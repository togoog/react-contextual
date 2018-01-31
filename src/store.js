import React from 'react'
import PropTypes from 'prop-types'
import { createContext } from 'react-broadcast'
import context from './context'

const StoreContext = createContext({})
export const Consumer = StoreContext.Consumer
export const connect = mapContextToProps => context(Consumer, mapContextToProps)

export class RenderOnce extends React.Component {
    shouldComponentUpdate() { return false }
    render() { return this.props.children }
}

export class Provider extends React.Component {
    static propTypes = {
        initialState: PropTypes.object.isRequired,
        actions: PropTypes.object.isRequired,
        renderOnce: PropTypes.bool,
    }
    static defaultProps = { renderOnce: true }
    constructor(props) {
        super()
        this.state = props.initialState || {}
        this.actions = Object.keys(props.actions).reduce(
            (accumulator, action) => ({
                ...accumulator,
                [action]: (...args) => {
                    const result = props.actions[action](...args)
                    this.setState(typeof result === 'function' ? result(this.state) : result)
                },
            }),
            {},
        )
    }
    render() {
        const value = { state: this.state, actions: this.actions }
        return (
            <StoreContext.Provider value={value}>
                {this.props.renderOnce ? <RenderOnce children={this.props.children} /> : this.props.children}
            </StoreContext.Provider>
        )
    }
}
