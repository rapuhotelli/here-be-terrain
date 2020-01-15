import ResizeObserver from '@juggle/resize-observer';
import React, { Component, MouseEvent, TouchEvent } from 'react';
import styled, { css } from 'styled-components';

import { EncounterEvents } from '../../../hbt-common/socketIoEvents';

import socket from '../socket';
import { Button } from '../styled_components/Button';
import { SectionTitle } from '../styled_components/Page';

import { getLayerData, hasLayerData, saveLayerData } from './EncounterLayerStorage';

const canvasRes = {
  width: 200,
  height: 200 * 9 / 16,
};

const DrawMode = {
  DRAW: 'draw',
  ERASE: 'erase',
};

const LayerContainer = styled.div`
  position: absolute;
  height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 1;

  ${(props: { zIndex?: number }) => props.zIndex && css`
    z-index: ${props.zIndex};
  `}
`;

const Canvas = styled.canvas`
  touch-action: none;
  opacity: 0.6;
  height: 100%;
  width: 100%;

  ${(props: { zIndex?: number }) => props.zIndex && css`
    opacity: ${0.4 + 0.1 * props.zIndex};
  `}
`;

const LayerActions = styled.div`
  position: absolute;
  top: 0;
  left: 100%;
  width: 25%;
  background-color: white;
  display: flex;
  flex-direction: column;
`;

const ActionButton = styled(Button)`
  margin: 4px;
  display: block;
`;

const ActionsTitle = styled(SectionTitle)`
  text-transform: capitalize;
  margin-top: 8px;
  margin-left: 4px;
`;

enum Brush {
  Rectangle,
  Circle,
}

const brushes: {[key: string]: Brush} = {
  rectangle: Brush.Rectangle,
  circle: Brush.Circle,
};

interface Props {
  campaign: string;
  encounter: string;
  layerId: string;
  color: string;
  alphaColor: string;
  selected: boolean;
  zIndex: number;
}
interface State {
  drawMode: string;
  layerData?: string | null;
  hasStoredData: boolean;
  posRatio: number[];
  brush: Brush;
  brushRadius: string;
}
export default class EncounterLayer extends Component<Props, State> {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  resizeObserver: ResizeObserver;
  constructor(props: Props) {
    super(props);

    this.state = {
      drawMode: DrawMode.DRAW,
      hasStoredData: false,
      posRatio: [1, 1],
      brush: Brush.Rectangle,
      brushRadius: '4',
    };

    this.canvasRef = React.createRef();

    this.storeData = this.storeData.bind(this);
    this.loadStoredData = this.loadStoredData.bind(this);
    this.drawData = this.drawData.bind(this);
    this.fillLayer = this.fillLayer.bind(this);
    this.emptyLayer = this.emptyLayer.bind(this);
    this.selectDrawMode = this.selectDrawMode.bind(this);
    this.selectBrush = this.selectBrush.bind(this);
    this.setBrushRadius = this.setBrushRadius.bind(this);
    this.draw = this.draw.bind(this);
    this.sendToScreen = this.sendToScreen.bind(this);
    this.setUpDrawScaling = this.setUpDrawScaling.bind(this);

    this.resizeObserver = new ResizeObserver(this.setUpDrawScaling);
  }

  componentDidMount() {
    this.emptyLayer();
    this.loadStoredData(true);
    
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    
    this.resizeObserver.unobserve(canvas);
    this.resizeObserver.observe(canvas);
  }

  componentWillUnmount() {
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    this.resizeObserver.unobserve(canvas);
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.layerId !== this.props.layerId) {
      this.componentDidMount();
    }
  }

  setUpDrawScaling() {
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

  loadStoredData(sendToScreen = false) {
    const { campaign, encounter, layerId } = this.props;

    const hasStoredData = hasLayerData(campaign, encounter, layerId);
    const layerData = getLayerData(campaign, encounter, layerId);

    this.setState({ layerData, hasStoredData }, () => {
      this.drawData(() => {
        if (hasStoredData && sendToScreen) {
          this.sendToScreen();
        }
      });
    });
  }

  drawData(afterDrawCallback = () => {}) {
    const { layerData } = this.state;
    if (!layerData) return;
  
    const canvas = this.canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const image = new Image;
    image.src = layerData;
    image.onload = () => {
      ctx.drawImage(image, 0, 0);
      afterDrawCallback();
    };
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

  selectBrush(event: React.ChangeEvent<HTMLSelectElement>) {
    const brush: Brush = brushes[event.target.value] || Brush.Rectangle;
    this.setState({ brush });
  }

  setBrushRadius(event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ brushRadius: event.target.value });
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
  
    const { color, alphaColor } = this.props;
    const { drawMode, posRatio, brush, brushRadius } = this.state;

    const canvasPos = canvas.getBoundingClientRect();

    const eventPos = [
      Math.floor((screenPos[0] - canvasPos.left) * posRatio[0]),
      Math.floor((screenPos[1] - canvasPos.top) * posRatio[1]),
    ];

    const radius = parseFloat(brushRadius) || 4;
    if (drawMode === DrawMode.DRAW) {
      ctx.fillStyle = color;
      if (brush === Brush.Circle) {
        const radgrad = ctx.createRadialGradient(eventPos[0], eventPos[1], 1, eventPos[0], eventPos[1], radius);
        radgrad.addColorStop(0, color);
        radgrad.addColorStop(0.9, color);
        radgrad.addColorStop(1, alphaColor);
        ctx.fillStyle = radgrad;
      }
      ctx.fillRect(eventPos[0] - radius, eventPos[1] - radius, 2*radius, 2*radius);
    } else if (drawMode === DrawMode.ERASE) {
      ctx.clearRect(eventPos[0] - radius, eventPos[1] - radius, 2*radius, 2*radius);
    }

    this.setState({ layerData: canvas.toDataURL() });    
  }

  sendToScreen() {
    const { campaign, encounter, layerId } = this.props;
    const canvas = this.canvasRef.current;
    if (!canvas) return;

    this.storeData();

    socket.emit(EncounterEvents.LAYER_UPDATE, campaign, encounter, layerId, canvas.toDataURL());
  }

  render() {
    const { layerId, zIndex, selected } = this.props;
    const { hasStoredData, layerData, drawMode, brushRadius } = this.state;
    return (
      <LayerContainer zIndex={zIndex}>
        <Canvas ref={this.canvasRef} width={canvasRes.width} height={canvasRes.height}
          onMouseMove={this.draw} onTouchMove={this.draw} zIndex={zIndex}></Canvas>
        { selected &&
          <LayerActions>
            <ActionsTitle>{layerId} layer actions:</ActionsTitle>
            <select onChange={this.selectBrush}>
              {Object.keys(brushes).map(key => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
            <input type='text' value={brushRadius} onChange={this.setBrushRadius} />
            <ActionButton active={drawMode === DrawMode.DRAW} onClick={() => this.selectDrawMode(DrawMode.DRAW)}>Draw</ActionButton>
            <ActionButton active={drawMode === DrawMode.ERASE} onClick={() => this.selectDrawMode(DrawMode.ERASE)}>Erase</ActionButton>
            <ActionButton onClick={this.fillLayer}>Fill layer</ActionButton>
            <ActionButton onClick={this.emptyLayer}>Empty layer</ActionButton>
            { layerData
              ? (<ActionButton onClick={this.storeData}>Store Data</ActionButton>)
              : undefined
            }
            { hasStoredData
              ? (<ActionButton onClick={() => this.loadStoredData()}>Load Stored Data</ActionButton>)
              : undefined
            }
            { layerData
              ? (<ActionButton onClick={this.sendToScreen}>Send Layer to Screen</ActionButton>)
              : undefined
            }
          </LayerActions>
        }
      </LayerContainer>
    );
  }
}
