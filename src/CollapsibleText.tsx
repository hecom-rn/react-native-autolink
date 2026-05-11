import { Icon } from 'core/common';
import PropTypes from 'prop-types';
import React, {
    Component,
} from 'react';

import {
    Dimensions,
    EmitterSubscription,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
export default class CollapsibleText extends Component {
    static _instanceCount = 0;

    static propTypes = {
        style: Text.propTypes?.style,
        expandTextStyle: Text.propTypes?.style,
        expandBorderStyle: Object,
        numberOfLines: PropTypes.number,
        rawText: PropTypes.string
    }

    changEmitter: EmitterSubscription;

    constructor(props) {
        super(props);
        this._instanceId = ++CollapsibleText._instanceCount;
        this._isHarmony = Platform.OS === 'harmony';
        this._fullHeight = null;
        this.state = {
            expanded: true,
            numberOfLines: null,
            showExpandText: false,
            measureFlag: true
        }
        this.numberOfLines = props.numberOfLines;
        this.needExpand = true;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.rawText !== this.props.rawText) {
            this.setState({ expanded: true, numberOfLines: null, showExpandText: false, measureFlag: true });
        }
    }

    componentDidMount() {
        this.changEmitter = Dimensions.addEventListener('change', this._onOrientationChange);
    }

    componentWillUnmount() {
        this.changEmitter?.remove();
    }

    _onOrientationChange = (e) => {
        this.setState({ expanded: true, numberOfLines: null, showExpandText: false, measureFlag: true });
    };

    _onPressExpand() {
        if (!this.state.expanded) {
            this.setState({ numberOfLines: null, expanded: true })
        } else {
            this.setState({ numberOfLines: this.numberOfLines, expanded: false })
        }
    }

    onTextLayout = (event) => {
        if (this.state.measureFlag) {
            if (event?.nativeEvent?.lines?.length > this.numberOfLines) {
                this.setState({ expanded: false, showExpandText: true, numberOfLines: this.numberOfLines, measureFlag: false });
            } else {
                this.setState({ showExpandText: false, numberOfLines: this.numberOfLines });
            }
        }
    };

    _onHarmonyLayout = (event) => {
        if (!this.state.measureFlag) return;
        const { height } = event.nativeEvent.layout;
        if (this.state.numberOfLines == null) {
            this._fullHeight = height;
            this.setState({ numberOfLines: this.numberOfLines });
        } else {
            if (this._fullHeight != null && this._fullHeight > height + 1) {
                this.setState({ expanded: false, showExpandText: true, measureFlag: false });
            } else {
                this.setState({ showExpandText: false, measureFlag: false });
            }
            this._fullHeight = null;
        }
    };

    render() {
        const { numberOfLines, onLayout, expandTextStyle, expandBorderStyle, ...rest } = this.props;
        const btnTitle = this.state.expanded ? '收起' : '全部';
        const iconName = this.state.expanded ? 'e605' : 'e606';
        let expandText = this.state.showExpandText ? (
            <TouchableOpacity
                onPress={this._onPressExpand.bind(this)}>
                <View style={[{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }, expandBorderStyle]}>
                    <Text
                        style={[this.props.style, styles.expandText, expandTextStyle]}>
                        {btnTitle}
                    </Text>
                    <Icon name={iconName} color={'#666666'} size={12} />
                </View>
            </TouchableOpacity>
        ) : null;
        return (
            <View>
                <Text
                    key={`collapsible-text-${this._instanceId}-${this.state.numberOfLines}`}
                    numberOfLines={this.state.numberOfLines}
                    {...(this._isHarmony
                        ? { onLayout: this._onHarmonyLayout }
                        : { onTextLayout: this.onTextLayout })}
                    {...rest}
                >
                    {this.props.children}
                </Text>
                {expandText}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    expandText: {
        color: '#1890FF',
        marginTop: 0,
    }
});
