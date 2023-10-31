import React from 'react'

export default function Index() {
    console.log(DemoFunction, DemoClass)
    return React.createElement(DemoFunction, { isProps: true },
        React.createElement(DemoClass, { isProps: false }, 'children')
    )
}

function DemoFunction() {
    return <div>DemoFunction</div>
}
class DemoClass {
    render() {
        return <div>DemoClass</div>
    }
} 