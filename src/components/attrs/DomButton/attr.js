export default {
  name: 'buttonName',
  cname: '按钮',
  attrsValue: {
    label: '我是一个按钮',
    arrayDome: [],
    custormStyle: {
      obj1: 'asdfaf',
      obj2: 'asdaf',
    },
  },
  attrs: [
    {
      name: 'label',
      cname: '显示名称',
      type: 'string',
    },
    {
      name: 'arrayDome',
      cname: '样式',
      type: 'array',
      children: [
        {
          name: 'name',
          cname: '参数名称',
          value: '',
          type: 'string',
        },
        {
          name: 'value',
          cname: '参数值',
          value: '',
          type: 'string',
        },
      ],
    },
    {
      name: 'custormStyle',
      cname: '样式',
      type: 'object',
      children: [
        {
          name: 'obj1',
          cname: '参数值',
          type: 'string',
        },
        {
          name: 'obj2',
          cname: '参数值',
          type: 'string',
        },
      ],
    },
  ],
};
