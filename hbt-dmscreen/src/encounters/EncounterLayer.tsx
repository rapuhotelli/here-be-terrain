import React, { Component, MouseEvent, TouchEvent } from 'react';
import styled from 'styled-components';

import { EncounterEvents } from '../../../hbt-common/socketIoEvents';

import socket from '../socket';
import { Button } from '../styled_components/Button';

import { getLayerData, hasLayerData, saveLayerData } from './EncounterLayerStorage';

const canvasRes = {
  width: 200,
  height: 200 * 9 / 16,
};

const DrawMode = {
  DRAW: 'draw',
  ERASE: 'erase',
};

const Canvas = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  z-index: 2;

  opacity: 0.6;
`;

const LayerActions = styled.div`
  position: absolute;
  top: 100%;
  width: 100%;
  z-index: 2;
`;

const ActionButton = styled(Button)`
  margin: 4px;
`;

interface Props {
  campaign: string;
  encounter: string;
  layerId: string;
  color: string;
}
interface State {
  drawMode: string;
  layerData?: string | null;
  hasStoredData: boolean;
  posRatio: number[];
}
export default class EncounterLayer extends Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  constructor(props: Props) {
    super(props);

    this.state = {
      drawMode: DrawMode.DRAW,
      hasStoredData: false,
      posRatio: [1, 1],
    };

    this.canvasRef = React.createRef();

    this.storeData = this.storeData.bind(this);
    this.loadStoredData = this.loadStoredData.bind(this);
    this.drawData = this.drawData.bind(this);
    this.fillLayer = this.fillLayer.bind(this);
    this.emptyLayer = this.emptyLayer.bind(this);
    this.selectDrawMode = this.selectDrawMode.bind(this);
    this.draw = this.draw.bind(this);
    this.sendToScreen = this.sendToScreen.bind(this);
  }

  componentDidMount() {
    this.loadStoredData();

    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const canvasSize = [
      canvas.scrollWidth,
      canvas.scrollHeight,
    ];

    const posRatio = [
      canvasRes.width / canvasSize[0],
      canvasRes.height / canvasSize[1],
    ];
    this.setState({ posRatio });
  }

  storeData() {
    const { campaign, encounter, layerId } = this.props;
  
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const layerData = canvas.toDataURL();

    saveLayerData(campaign, encounter, layerId, layerData);
    this.setState({ layerData, hasStoredData: true });
  }

  loadStoredData() {
    const { campaign, encounter, layerId } = this.props;

    const hasStoredData = hasLayerData(campaign, encounter, layerId);
    const layerData = getLayerData(campaign, encounter, layerId);

    this.setState({ layerData, hasStoredData }, () => this.drawData());
  }

  drawData() {
    const { layerData } = this.state;
    if (!layerData) return;
  
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const image = new Image;
    image.src = layerData;
    image.onload = () => ctx.drawImage(image, 0, 0);
  }

  fillLayer() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const { color } = this.props;

    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    this.setState({ layerData: canvas.toDataURL() });
  }

  emptyLayer() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    this.setState({ layerData: canvas.toDataURL() });
  }

  selectDrawMode(drawMode: string) {
    this.setState({ drawMode });
  }

  draw(event: MouseEvent | TouchEvent) {
    let screenPos = [0, 0];
    let shouldDraw = false;
    if ('buttons' in event) {
      if ((event.buttons & 1) > 0) {
        shouldDraw = true;
        screenPos = [event.clientX, event.clientY];
      }
    } else {
      shouldDraw = true;
      screenPos = [event.targetTouches[0].clientX, event.targetTouches[0].clientY];
    }

    if (!shouldDraw) return;

    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    const { color } = this.props;
    const { drawMode, posRatio } = this.state;

    const canvasPos = canvas.getBoundingClientRect();

    const eventPos = [
      Math.floor((screenPos[0] - canvasPos.left) * posRatio[0]),
      Math.floor((screenPos[1] - canvasPos.top) * posRatio[1]),
    ];

    if (drawMode === DrawMode.DRAW) {
      ctx.fillStyle = color;
      ctx.fillRect(eventPos[0] - 3, eventPos[1] - 3, 8, 8);
    } else if (drawMode === DrawMode.ERASE) {
      ctx.clearRect(eventPos[0] - 3, eventPos[1] - 3, 8, 8);
    }
  }

  sendToScreen() {
    const { campaign, encounter, layerId } = this.props;
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    this.storeData();

    socket.emit(EncounterEvents.LAYER_UPDATE, campaign, encounter, layerId, canvas.toDataURL());
  }

  render() {
    const { hasStoredData, layerData, drawMode } = this.state;
    return (
      <div>
        <Canvas ref={this.canvasRef} width={canvasRes.width} height={canvasRes.height}
          onMouseMove={this.draw} onTouchMove={this.draw}></Canvas>
        <LayerActions>
          <ActionButton active={drawMode === DrawMode.DRAW} onClick={() => this.selectDrawMode(DrawMode.DRAW)}>Draw</ActionButton>
          <ActionButton active={drawMode === DrawMode.ERASE} onClick={() => this.selectDrawMode(DrawMode.ERASE)}>Erase</ActionButton>
          <ActionButton onClick={this.fillLayer}>Fill layer</ActionButton>
          <ActionButton onClick={this.emptyLayer}>Empty layer</ActionButton>
          { layerData
            ? (<ActionButton onClick={this.storeData}>Store Data</ActionButton>)
            : undefined
          }
          { hasStoredData
            ? (<ActionButton onClick={this.loadStoredData}>Load Stored Data</ActionButton>)
            : undefined
          }
          { layerData
            ? (<ActionButton onClick={this.sendToScreen}>Send to Screen</ActionButton>)
            : undefined
          }
        </LayerActions>
      </div>
    );
  }
}