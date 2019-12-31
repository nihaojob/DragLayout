# 说明

安装
```bash
npm install
```
or
```bash
yarn
```
项目使用umi脚手架创建的，使用的是Ant Design Pro模板。
启动的时候可能会包bable的版本错误，搜一下换个版本就好了，环境Start，哈哈。

[演示地址](https://nihaojob.github.io/DragLayout/)

### 反思
这是一个笨拙的数据结构，你会发现如果使用react来对tree进行渲染和开发时，性能将成为一个瓶颈。

### 实现思路

现在有很多优秀的拖拽布局工具，[表单设计器](http://tools.xiaoyaoji.cn/form/#/)，[layui拖拽布局](http://lowcode.magicalcoder.com/layui), [Vue-Layout](https://jaweii.github.io/Vue-Layout/dist/#/)。

我们最近也实现了类似的功能，废话不多说，先把预览贴出来（不知道为什么掘金现在图片不支持gif了，还要自己上传到图床）。

![](https://user-gold-cdn.xitu.io/2019/10/20/16de6cc8698acd56?w=1121&h=584&f=gif&s=397631)
![](https://user-gold-cdn.xitu.io/2019/10/20/16de6cd0ee554ebd?w=1121&h=584&f=gif&s=351009)
![](https://user-gold-cdn.xitu.io/2019/10/20/16de6cd95e45b824?w=1121&h=584&f=gif&s=217033)

在实现这个的功能的过程中，也走了一点弯路，我们内部1.0版本的时候，使用的是`sortablejs`，由于代码写的比较混乱，拖拽功能经常出现卡死的现象，以为是`sortablejs`的问题，然后又换成大名鼎鼎的`React Dnd`，和`Redux`是同一个作者，但是Dnd并不是太符合我们的需求，拖拽的API确实很强大，但是排序、跨级拖拽等好多功能都要自己手动实现，在实现完跨级拖拽以后，老大让我换成了`sortablejs`。

拖拽工具：[sortablejs](http://sortablejs.github.io/Sortable/)
，[React Dnd](http://react-dnd.github.io/react-dnd/)

我们还是先说下思路，还有我们在1.0里给自己挖的坑，你们也要小心哈😂。

如果有过树组件开发经验的小伙伴，应该对**递归**很熟悉了，左侧的页面结构要用到，右侧的渲染也要用到，整体来说，左侧的组件树和右侧的画布区，就是两个递归函数。

### 页面即数组，组件即对象
我们要生成页面，肯定不是只看看页面长什么样子，好不好看，而是要把数据保存起来，生成我们想要的格式，首先就要面临的问题是，这个数据应该长什么样子，都有哪些字段，分别干什么用。

页面即数组很好理解，一个页面上可以有多个组件，而且有顺序，用数组就比较方便了，如果有子元素怎么办，不管vue还是react，UI框里都会有`Tree`组件，数据格式都是使用`children`向下嵌套数据组，这点好理解吧？

举个栗子，iview的tree组件[文档](https://www.iviewui.com/components/tree)
![](https://user-gold-cdn.xitu.io/2019/10/20/16de6e99d8026311?w=2116&h=1566&f=png&s=195924)

子元素和我们有什么关系呢，我们看[表单设计器](http://tools.xiaoyaoji.cn/form/#/)和[layui拖拽布局](http://lowcode.magicalcoder.com/layui)里，都有**容器组件**，什么意思呢，就是可以在这个组件下继续拖拽放入组件，如果数据无限的向下延伸，那就需要`children`帮忙向下无限嵌套。

![](https://user-gold-cdn.xitu.io/2019/10/20/16de6f06476e553b?w=1332&h=1322&f=png&s=227412)

![](https://user-gold-cdn.xitu.io/2019/10/20/16de6f163e826a9f?w=1726&h=1324&f=png&s=187847)

嵌套的问题解决了，组件怎么渲染呢，我们先不考虑拖拽的问题，单单一个数据对象渲染成组件，怎么实现呢？
先大致想一下，我们如果使用`Ant Design`的组件，我们得知道组件的名称吧？得有自己`props`吧？
暂定两个字段`name`和`attr`，包括上面提到的`children`字段，我们先简单的做个demo，用ant的模板。


```js
import React, { Component } from 'react';
import { Rate,Input,DatePicker } from 'antd';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const GlobalComponent = {
    Rate,
    Input,
    MonthPicker,
    RangePicker,
    WeekPicker,
}


class EditPage extends Component {

    render() {
        
        // 测试数据
        const Data = [
            {
                name: 'Input',
                attr: {
                    size:'large',
                    value:'第一个'
                }
            },
            {
                name: 'Input',
                attr: {
                    size:'default',
                    value:'第二个'
                }
            },
            {
                name: 'Input',
                attr: {
                    size:'small',
                    value:'第三个'
                }
            },
            {
                name: 'Containers',
                attr: {
                    style:{
                        border:'1px solid red'
                    }
                },
                children:[
                    {
                        name: 'Input',
                        attr: {
                            size:'small',
                            value:'嵌套的input'
                        }
                    },
                    {
                        name: 'Rate',
                        attr: {
                            size:'small',
                            value:'嵌套的input'
                        }
                    },
                    {
                        name: 'MonthPicker',
                        attr: {}
                    },
                    {
                        name: 'RangePicker',
                        attr: {}
                    },
                    {
                        name: 'WeekPicker',
                        attr: {}
                    },
                ]

            },
        ];
        
        // 递归函数
        const loop = (arr) => (
            arr.map(item => {
                if(item.children){
                    return <div {...item.attr} >{loop(item.children)}</div>
                }
                const ComponentInfo = GlobalComponent[item.name]
                return <ComponentInfo {...item.attr} />
            })
        );

        return (
            <>
                {loop(Data)}
            </>
        );
    }
}

export default EditPage;

```

页面已经渲染出来了，怎么样 很简单吧？ 接下来 我们一起来实现拖拽吧

![](https://user-gold-cdn.xitu.io/2019/10/20/16de756a1de2405f?w=2610&h=850&f=png&s=75190)

### 拖拽的实现
数据格式我们有了，渲染也实现了，剩下的就是拖拽了，我们先了解一下了[sortablejs](http://sortablejs.github.io/Sortable/)这个插件，官方有提供`react`版的组件`react-sortablejs`。

安装依赖，在页面中引入组件，不多说，看[react-sortablejs文档](https://github.com/SortableJS/react-sortablejs)。

接下来先说一下`sortablejs`**提供给我们什么功能**。

1. 如果从容器A拖拽到容器B，两个容器`group`参数的`name`保持一致才能实现相互拖拽。
2. 容器是否可移入和移出，是在`group`中配置`pull`和`put`属性。
3. 容器有两个监听事件，一个是移入的`onAdd`方法，一个是更新的`onUpdate`方法
4. `onAdd`和`onUpdate`只能监听到拖拽元素的`data-id`属性

我们怎么借助这些功能实现？
1. 组件列表，就是左侧供我们拖拽的源组件列表，不能移出，并且`data-id`需要为组件名称，才能告知右侧的容器拖拽进入的是什么组件。
2. 右侧容器需要嵌套，递归展示，有子元素时要展示容器而不是组件。
3. 右侧的容器要可移入移出，方便跨容器拖拽。
4. 为了把新增的组件数据放进右侧对应的位置，右侧容器的`data-id`修改为下标的路径`2-3-2`这样的形式，对应根数组的第2个元素的第3个子元素的第2个子元素。

好了，现在先把供我们拖拽的源组件列表写出来

然后把右侧的容器改造一下，如果有子元素则展示一个新的容器，并且加上add的监听方法。

![](https://user-gold-cdn.xitu.io/2019/10/20/16de8bd55d219032?w=1046&h=549&f=gif&s=755753)
需要注意的是，跨级拖拽的时候触发`onAdd`，需要判断一下进入的`data-id`到底是下标还是组件，如果为组件直接添加，如果为下标，则**对比一下新增和删除的路径，先操作靠下方的路径，再操作靠上的路径**。

``` js
import React, { Component } from 'react';
import { Rate,Input,DatePicker,Tag } from 'antd';
import Sortable from 'react-sortablejs';
import uniqueId from 'lodash/uniqueId';
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;
import { indexToArray, getItem, setInfo, isPath, getCloneItem, itemRemove, itemAdd } from './utils';
import find from 'find-process';
const GlobalComponent = {
    Rate,
    Input,
    MonthPicker,
    RangePicker,
    WeekPicker,
}


const soundData = [
    {
        name: 'MonthPicker',
        attr: {}
    },
    {
        name: 'RangePicker',
        attr: {}
    },
    {
        name: 'WeekPicker',
        attr: {}
    },
    {
        name: 'Input',
        attr: {
            size:'large',
            value:'第一个'
        }
    },
    {
        name: 'Containers',
        attr: {
            style:{
                border:'1px solid red'
            }
        },
    }
]

class EditPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            Data:[{
                name: 'Input',
                attr: {
                    size:'large',
                    value:'第一个'
                } 
            }],
        };
    }

     // 拖拽的添加方法
     sortableAdd = evt => {
        // 组件名或路径
        const nameOrIndex = evt.clone.getAttribute('data-id');
        // 父节点路径
        const parentPath = evt.path[1].getAttribute('data-id');
        // 拖拽元素的目标路径
        const { newIndex } = evt;
        // 新路径 为根节点时直接使用index
        const newPath = parentPath ? `${parentPath}-${newIndex}` : newIndex;
        // 判断是否为路径 路径执行移动，非路径为新增
        if (isPath(nameOrIndex)) {
            // 旧的路径index
            const oldIndex = nameOrIndex;
            // 克隆要移动的元素
            const dragItem = getCloneItem(oldIndex, this.state.Data)
            // 比较路径的上下位置 先执行靠下的数据 再执行考上数据
            if (indexToArray(oldIndex) > indexToArray(newPath)) {
                // 删除元素 获得新数据
                let newTreeData = itemRemove(oldIndex, this.state.Data);
                // 添加拖拽元素
                newTreeData = itemAdd(newPath, newTreeData, dragItem)
                // 更新视图
                this.setState({Data:newTreeData})
                return
            }
            // 添加拖拽元素
            let newData = itemAdd(newPath, this.state.Data, dragItem)
            // 删除元素 获得新数据
            newData = itemRemove(oldIndex, newData);

            this.setState({Data:newData})
            return
        }

        // 新增流程 创建元素 => 插入元素 => 更新视图
        const id = nameOrIndex
        
        const newItem = _.cloneDeep(soundData.find(item => (item.name === id)))
        
        // 为容器或者弹框时增加子元素
        if ( newItem.name === 'Containers') {
            const ComponentsInfo = _.cloneDeep(GlobalComponent[newItem.name])
            // 判断是否包含默认数据
            newItem.children = []
        }
        
        let Data = itemAdd(newPath, this.state.Data, newItem)
        
        this.setState({Data})
    }

    render() {
        
        // 递归函数
        const loop = (arr,index) => (
            arr.map((item,i) => {
                const indexs = index === '' ? String(i) : `${index}-${i}`;
                if(item.children){
                    return <div {...item.attr} 
                        data-id={indexs}
                    >
                        <Sortable
                            key={uniqueId()}
                            style={{
                                minHeight:100,
                                margin:10,
                            }}
                            ref={c => c && (this.sortable = c.sortable)}
                            options={{
                                ...sortableOption,
                                // onUpdate: evt => (this.sortableUpdate(evt)),
                                onAdd: evt => (this.sortableAdd(evt)),
                            }}
                        >
                            {loop(item.children,indexs)}
                        </Sortable>
                    </div>
                }
                const ComponentInfo = GlobalComponent[item.name]
                return <div data-id={indexs}><ComponentInfo {...item.attr} /></div>
            })
        )

        const sortableOption = {
            animation: 150,
            fallbackOnBody: true,
            swapThreshold: 0.65,
            group: {
                name: 'formItem',
                pull: true,
                put: true,
            },
        }

        return (
            <>  
                <h2>组件列表</h2>
                <Sortable
                    options = {{
                            group:{
                                name: 'formItem',
                                pull: 'clone',
                                put: false,
                            },
                            sort: false,
                        }}
                >
                    {
                        soundData.map(item => {
                            return <div data-id={item.name}><Tag>{item.name}</Tag></div>
                        })
                    }
                </Sortable>
                <h2>容器</h2>
                <Sortable
                    ref={c => c && (this.sortable = c.sortable)}
                    options={{
                        ...sortableOption,
                        // onUpdate: evt => (this.sortableUpdate(evt)),
                        onAdd: evt => (this.sortableAdd(evt)),
                    }}
                    key={uniqueId()}
                >
                    {loop(this.state.Data,'')}
                </Sortable>
            </>
        );
    }
}

export default EditPage;
```

现在跨级操作和新增已经完成了，接下来我们补充一下同级交换位置的功能，我们用了`immutability-helper`这个工具函数，具体的自己看文档吧，只是用到了数组换位。

```js
import update from 'immutability-helper'

// 拖拽的排序方法
sortableUpdate = evt => {
    // 交换数组
    const { newIndex, oldIndex } = evt;

    // 父节点路径
    const parentPath = evt.path[1].getAttribute('data-id');

    // 父元素 根节点时直接调用data
    let parent = parentPath ? getItem(parentPath, this.state.Data) : this.state.Data;
    // 当前拖拽元素
    const dragItem = parent[oldIndex];
    // 更新后的父节点
    parent = update(parent, {
        $splice: [[oldIndex, 1], [newIndex, 0, dragItem]],
    });

    // 最新的数据 根节点时直接调用data
    const Data = parentPath ? setInfo(parentPath, this.state.Data, parent) : parent
    // 调用父组件更新方法
    this.setState({Data})
}
```
现在跨级和同级的排序的功能都已经完成了，我们看看预览图吧。

![](https://user-gold-cdn.xitu.io/2019/10/20/16de8cab1fc829e4?w=1046&h=549&f=gif&s=805784)

在`onUpdate`和`onAdd`的函数中，自己封装了一些根据下标操作数组的方法，也是按照函数式的方式，每个函数返回新的结果，写的不是特别好，多多见谅哈，剩下的删除、选中啦，根据自己的需求增加功能就可以了，我把源码放在了github上，有需要的拿去吧，码字码到手酸，吃饭去了😂。











