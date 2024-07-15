const LazyImport = (props) => {
    console.log('LazyImport: ', props)
    return <div>LazyImport: {props.value.test}</div>
}

export default LazyImport
