import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'core/common';

import {
    View,
    Image,
    StyleSheet,
    Animated,
    Text,
    TouchableOpacity,
    ViewStyle,
    Dimensions,
    EmitterSubscription
} from 'react-native';
export default class CollapsibleText extends Component {
    static propTypes = {
        style: Text.propTypes?.style,
        expandTextStyle:Text.propTypes?.style,
        expandBorderStyle: ViewStyle,
        numberOfLines: PropTypes.number,
        rawText: PropTypes.string
    }

    changEmitter: EmitterSubscription;

    constructor(props){
        super(props);
        this.state = {
            /** 文本是否展开 */
            expanded:true,
            numberOfLines:null,
            /** 展开收起文字是否处于显示状态 */
            showExpandText:false,
            /** 是否处于测量阶段 */
            measureFlag:true
        }
        this.numberOfLines = props.numberOfLines;
        /** 文本是否需要展开收起功能：（实际文字内容是否超出numberOfLines限制） */
        this.needExpand = true;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if(nextProps.rawText!==this.props.rawText){
            this.setState({expanded:true, numberOfLines:null, showExpandText:false, measureFlag:true});
        }}

    componentDidMount() {
        this.changEmitter = Dimensions.addEventListener('change', this._onOrientationChange);
    }

    componentWillUnmount() {
        this.changEmitter?.remove();
    }

    _onOrientationChange = (e) => {
        this.setState({expanded:true, numberOfLines:null, showExpandText:false, measureFlag:true});
    };

    _onPressExpand(){
        if(!this.state.expanded){
            this.setState({numberOfLines:null,expanded:true})
        }else{
            this.setState({numberOfLines:this.numberOfLines,expanded:false})
        }
    }

    onTextLayout = (event) => {
        if (this.state.measureFlag) {
            if (event?.nativeEvent?.lines?.length > this.numberOfLines) {
                this.setState({ expanded:false, showExpandText: true, numberOfLines: this.numberOfLines, measureFlag: false});
            } else {
                this.setState({ showExpandText: false, numberOfLines:this.numberOfLines});
            }
        }
    };

    render() {
        const { numberOfLines, onLayout, expandTextStyle, expandBorderStyle, ...rest } = this.props;
        const btnTitle = this.state.expanded ? '收起' : '全部';
        const iconName = this.state.expanded ? 'e605' : 'e606';
        let expandText = this.state.showExpandText?(
            <TouchableOpacity
                onPress={this._onPressExpand.bind(this)}>
                <View style={[{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'center' }, expandBorderStyle]}>
                    <Text
                        style={[this.props.style,styles.expandText,expandTextStyle]}>
                        {btnTitle}
                    </Text>
                    <Icon name={iconName} color={'#666666'} size={12} />
                </View>
            </TouchableOpacity>
        ) : null;
        return (
            <View>
                <Text
                    numberOfLines={this.state.numberOfLines}
                    onTextLayout={this.onTextLayout}
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
        color:'#1890FF',
        marginTop:0,
    }
});
