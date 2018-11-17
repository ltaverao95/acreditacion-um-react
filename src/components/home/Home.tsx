import * as React from "react";

export interface HomeProps { compiler: string; framework: string; }

export class HomeComponent extends React.Component<HomeProps, undefined> {
    render() {
        return <h1>Hello from {this.props.compiler} and {this.props.framework}!</h1>;
    }
}