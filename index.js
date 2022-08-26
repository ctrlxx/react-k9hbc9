import G6 from '@antv/g6';

/**
 * by Shiwu
 */

const data = {
  nodes: [
    {
      id: 'person A',
      label: 'person A',
      // the attributes for drawing donut
      donutAttrs: {
        income: 10,
        outcome: 20,
        unknown: 25,
      },
      comboId: 'A',
    },
    {
      id: 'person B',
      label: 'person B',
      donutAttrs: {
        income: 20,
        outcome: 10,
        unknown: 5,
      },
      comboId: 'A',
    },
    {
      id: 'person C',
      label: 'person C',
      donutAttrs: {
        income: 200,
        outcome: 20,
        unknown: 25,
      },
      comboId: 'A',
    },
    {
      id: 'person D',
      label: 'person D',
      donutAttrs: {
        income: 50,
        outcome: 10,
        unknown: 15,
      },
      comboId: 'B',
    },
    {
      id: 'person E',
      label: 'person E',
      donutAttrs: {
        income: 80,
        outcome: 40,
        unknown: 45,
      },
      comboId: 'B',
    },
    {
      id: 'person F',
      label: 'person F',
      donutAttrs: {
        income: 90,
        outcome: 110,
        unknown: 15,
      },
    },
  ],
  edges: [
    { source: 'person C', target: 'person F', size: 10 },
    { source: 'person B', target: 'person A', size: 5 },
    { source: 'person D', target: 'person E', size: 20 },
    { source: 'person D', target: 'person C', size: 5 },
    { source: 'person B', target: 'person C', size: 10 },
    { source: 'person A', target: 'person C', size: 5 },
  ],
  combos: [
    {
      id: 'A',
      label: 'combo A',
      style: {
        fill: '#C4E3B2',
        stroke: '#C4E3B2',
      },
    },
    {
      id: 'B',
      label: 'combo B',
      style: {
        stroke: '#99C0ED',
        fill: '#99C0ED',
      },
    },
  ],
};

data.nodes.forEach((node) => {
  switch (node.ComboId) {
    case 'A':
      node.style = {
        fill: '#C4E3B2',
        stroke: '#aaa',
      };
      break;
    case 'B':
      node.style = {
        fill: '#99C0ED',
        stroke: '#aaa',
      };
      break;
    default:
      node.style = {
        fill: '#FDE1CE',
        stroke: '#aaa',
      };
      break;
  }
});

data.edges.forEach((edge) => {
  edge.label = `Transfer $${edge.size}`;
});

const colors = {
  income: '#61DDAA',
  outcome: '#F08BB4',
  unknown: '#65789B',
};

data.nodes.forEach((node) => {
  node.donutColorMap = colors;
  node.size = 0;
  Object.keys(node.donutAttrs).forEach((key) => {
    node.size += node.donutAttrs[key];
  });
  node.size = Math.sqrt(node.size) * 5;
});

const legendData = {
  nodes: [
    {
      id: 'income',
      label: 'Income',
      order: 0,
      style: {
        fill: '#61DDAA',
      },
    },
    {
      id: 'outcome',
      label: 'Outcome',
      order: 2,
      style: {
        fill: '#F08BB4',
      },
    },
    {
      id: 'unknown',
      label: 'Unknown',
      order: 2,
      style: {
        fill: '#65789B',
      },
    },
  ],
};
const legend = new G6.Legend({
  data: legendData,
  align: 'center',
  layout: 'horizontal', // vertical
  position: 'bottom-left',
  vertiSep: 12,
  horiSep: 24,
  offsetY: -24,
  padding: [4, 16, 8, 16],
  containerStyle: {
    fill: '#ccc',
    lineWidth: 1,
  },
  title: ' ',
  titleConfig: {
    offsetY: -8,
  },
});

const timeBarData = [];

for (let i = 1; i < 60; i++) {
  const month = i < 30 ? '01' : '02';
  const day = i % 30 < 10 ? `0${i % 30}` : `${i % 30}`;
  timeBarData.push({
    date: parseInt(`2020${month}${day}`),
    value: Math.round(Math.random() * 300),
  });
}

let count = 0;
const timebar = new G6.TimeBar({
  x: 0,
  y: 0,
  width,
  height: 150,
  padding: 10,
  type: 'tick',
  tick: {
    data: timeBarData,
    width: width,
    height: 42,
    padding: 2,
    tickLabelFormatter: (d) => {
      count++;
      const dateStr = `${d.date}`;
      if ((count - 1) % 10 === 0) {
        return `${dateStr.substr(0, 4)}-${dateStr.substr(
          4,
          2
        )}-${dateStr.substr(6, 2)}`;
      }
      return false;
    },
    tooltipFomatter: (d) => {
      const dateStr = `${d}`;
      return `${dateStr.substr(0, 4)}-${dateStr.substr(4, 2)}-${dateStr.substr(
        6,
        2
      )}`;
    },
  },
});

const width = document.getElementById('container').scrollWidth;
const height = document.getElementById('container').scrollHeight || 500;
const graph = new G6.Graph({
  container: 'container',
  width,
  height,
  // translate the graph to align the canvas's center, support by v3.5.1
  fitCenter: true,
  plugins: [legend, timebar],
  modes: {
    default: ['drag-canvas', 'drag-node', 'drag-combo'],
  },
  layout: {
    type: 'radial',
    focusNode: 'li',
    linkDistance: 200,
    sortByCombo: true,
    unitRadius: 200,
  },
  defaultEdge: {
    style: {
      endArrow: true,
    },
    labelCfg: {
      autoRotate: true,
      style: {
        stroke: '#fff',
        lineWidth: 5,
      },
    },
  },
  defaultNode: {
    type: 'donut',
    style: {
      lineWidth: 0,
    },
    labelCfg: {
      position: 'bottom',
    },
  },
});

graph.data(data);
graph.render();

graph.on('node:mouseenter', (evt) => {
  const { item } = evt;
  graph.setItemState(item, 'active', true);
});

graph.on('node:mouseleave', (evt) => {
  const { item } = evt;
  graph.setItemState(item, 'active', false);
});

graph.on('node:click', (evt) => {
  const { item } = evt;
  graph.setItemState(item, 'selected', true);
});
graph.on('canvas:click', (evt) => {
  graph.getNodes().forEach((node) => {
    graph.clearItemStates(node);
  });
});
