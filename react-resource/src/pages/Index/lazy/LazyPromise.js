let data = 'not resolve'
//可以通过throw promise的方式实现异步加载
const LazyPromise = () => {
    return <div>LazyPromise: {data}</div>
}

export default LazyPromise