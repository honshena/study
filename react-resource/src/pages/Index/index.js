import React from "react";
import ReactDOM from "react-dom";
import PropTypes, { func } from "prop-types";
import LazyPromise from "./lazy/LazyPromise";
//调试入口
export default function Index() {
  return (
    <Props value={{ test: true }}>
      <Ref />
      <ContextParent />
      <Suspense />
      <Hooks></Hooks>
      <Children></Children>
      <TestMemoAndPureCOmponent></TestMemoAndPureCOmponent>
      <Element></Element>
    </Props>
  );
}
//props
function Props(props) {
  return (
    <div>
      Props: {props.value.test}
      <div>{props.children}</div>
    </div>
  );
}
Props.propTypes = {
  value: PropTypes.object,
};
//ref的使用
class Ref extends React.Component {
  //ref
  methodRef = null;
  createRef = React.createRef();
  //forwardRef
  //只有函数组件可以使用forwardRef
  functionForwardRef = React.createRef();
  componentDidMount() {
    //ref的三种使用方式
    //1. this.refs中将收集所有的string类型的refs
    //string类型的ref将作为refs的属性
    console.log("string ref: ", this.refs);
    console.log("refString: ", this.refs.refString);
    //2. method ref在使用时ref={(e)=>{}}传入一个函数,参数是绑定ref的变量,
    //可以在这个函数中将传入的dom元素赋值给组件的某个变量
    console.log("method ref: ", this.methodRef);
    //3. 使用React.createRef()创建一个ref引用并赋值给某个变量
    //然后给绑定ref的组件使用ref={this.createRef}
    console.log("React.createRef: ", this.createRef);
    //forwardRef,需要先创建React.createRef(),然后通过forwardRef传递给子组件
    console.log("React.forwardRef: ", this.functionForwardRef);
  }
  render() {
    return (
      <div>
        <h2>Ref</h2>
        <p ref="refString">string ref</p>
        <p
          ref={(e) => {
            this.methodRef = e;
          }}
        >
          method ref
        </p>
        <p ref={this.createRef}>createRef ref</p>
        <ForwardRefFunction ref={this.functionForwardRef}></ForwardRefFunction>
      </div>
    );
  }
}
//forwardRef的使用
const ForwardRefFunction = React.forwardRef((props, ref) => {
  return <h2 ref={ref}>forwardRef</h2>;
});

const Context = React.createContext("defaultContext");
//context
class ContextParent extends React.Component {
  //需要
  render() {
    return (
      <Context.Provider value={{ str: "currentContext" }}>
        <h2>createContext</h2>
        <ContextChild></ContextChild>
      </Context.Provider>
    );
  }
}

class ContextChild extends React.Component {
  render() {
    return (
      <Context.Consumer>
        {
          //Consumer的children是返回一个函数,函数的参数是当前的context值
          //返回的值是React Element
          (value) => {
            console.log("ContextChild: ", value);
            return <p>{value.str}</p>;
          }
        }
      </Context.Consumer>
    );
  }
}
//并发渲染
class concurrentMode extends React.Component {
  componentDidMount() {}
  render() {
    return <div></div>;
  }
}

//Suspense
const LazyImport = React.lazy(() => import("./lazy/LazyImport"));

class Suspense extends React.Component {
  render() {
    //所有的子组件全部加载后才会去掉fallback
    //createElement是传入的是REACT_SUSPENSE_TYPE
    return (
      <React.Suspense fallback="loading...">
        <h2>Suspense</h2>
        <LazyImport value={{ test: true }}></LazyImport>
        <LazyPromise></LazyPromise>
      </React.Suspense>
    );
  }
}

//hooks
const { useState, useMemo, useCallback, useContext, useEffect } = React;
function Hooks() {
  //useContext
  const context = useContext(Context);
  console.log("useContext: ", context);
  //useState
  const [state, setState] = useState(0);
  const changeState = () => {
    setState(state + 1);
  };
  //useCallback
  const log = useCallback(() => {
    console.log("useCallback");
    return state;
  }, [state]);
  console.log("update callback: ", log());

  //useEffect
  useEffect(() => {
    console.log("useEffect");
    //函数组件每一次更新都会先卸载再重新创建
    return () => {
      console.log("useEffect卸载");
    };
  }, [state]);
  //useMemo
  const memo = useMemo(() => {
    console.log("useMemo");
    return state;
  }, [state]);
  // useImperativeHandle,
  // useDebugValue,
  // useLayoutEffect,
  // useReducer,
  return (
    <div>
      <h2>Hooks</h2>
      <a onClick={changeState} href="#">
        changeState
      </a>
      <div>useState: {state}</div>
      <div>useMemo: {memo}</div>
      <div>useContext: {context}</div>
    </div>
  );
}

//Children
function Children() {
  //spans是一个由Fragment包裹的组件
  const spans = (
    <>
      <span>1</span>
      <span>
        2<span>2-1</span>
        <span>2-2</span>
      </span>
      <span>3</span>
    </>
  );
  //map
  console.log(
    "Children map:",
    React.Children.map(
      spans.props.children,
      (context, child, count) => {
        //context是当前递归的子元素,child是当前子元素的索引
        //需要注意的是func.call(context, child, bookKeeping.count++)是三个参数但实际是(v,i)
        //第三个参数bookKeeping.count++将是Undefined
        console.log("mapSingleChildIntoContext: ", context, child, count);
        //如果返回的是数组
        return context.props.children;
      },
      Context
    )
  );
  //forEach
  console.log(
    "Children forEach: ",
    React.Children.forEach(spans.props.children, (v, i) => {
      console.log("forEachSingleChild: ", v, i);
      return v.props.children;
    })
  );
  //count
  console.log("Children count: ", React.Children.count(spans.props.children));
  //toArray
  console.log(
    "Children toArray: ",
    React.Children.toArray(spans.props.children)
  );
  //only
  try {
    React.Children.only(spans.props.children);
  } catch (e) {
    console.log("Children only: ", e);
  }
  return (
    <div>
      <h2>Children</h2>
    </div>
  );
}

//memo
const Memo = React.memo(
  (props) => {
    return <p>memo props: {props.test}</p>;
  },
  (oldProps, newProps) => {
    //需要更新返回false,不需要更新返回true
    if (oldProps.test !== newProps.test) {
      console.log("Memo props change");
      return false;
    }
    console.log("Memo props no change");
    return true;
  }
);
//pureComponent
class PureComponent extends React.PureComponent {
  state = {
    test: 0,
  };
  changeState = () => {
    this.setState({
      test: this.state.test + 1,
    });
  };
  render() {
    return (
      <div>
        <a href="#" onClick={this.changeState}>
          changeState
        </a>
        <p>PureComponent props: {this.props.test}</p>
        <p>PureComponent state: {this.state.test}</p>
      </div>
    );
  }
}
function TestMemoAndPureCOmponent() {
  const [count, setCount] = useState(0);
  const [otherProps, setOtherProps] = useState(0);
  const changeProps = () => {
    setCount(count + 1);
  };
  const changeOtherProps = () => {
    setOtherProps(otherProps + 1);
  };
  return (
    <div>
      <h2>Memo And PureCOmponent</h2>
      <a href="#" onClick={changeProps}>
        change props test
      </a>
      <br></br>
      <a href="#" onClick={changeOtherProps}>
        change props other
      </a>
      <div>other props: {otherProps}</div>
      <Memo test={count}></Memo>
      <PureComponent test={count}></PureComponent>
    </div>
  );
}

//其他api
function Element() {
  //createElementWithValidation
  const createElement = React.createElement(
    "span",
    { value: 1, children: "1" },
    "children1"
  );
  //cloneElementWithValidation
  const cloneElement = React.cloneElement(
    createElement,
    { value: 2 },
    "children2"
  );
  //createFactoryWithValidation
  //此辅助函数已废弃，建议使用 JSX 或直接调用 React.createElement() 来替代它。
  const factoryElement = React.createFactory("span");
  //isValidElement
  const isValidElement = React.isValidElement(createElement);
  console.log("createElement: ", createElement);
  console.log("cloneElement: ", cloneElement);
  console.log("factoryElement: ", factoryElement);
  console.log("isValidElement: ", isValidElement);
  return (
    <div>
      <h2>Element</h2>
      {createElement}
      {cloneElement}
    </div>
  );
}
