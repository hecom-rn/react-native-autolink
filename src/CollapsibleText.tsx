import React, {
    Component,
} from 'react';
import PropTypes from 'prop-types';
import Icon from 'core/common/Icon';

import { View, Image, StyleSheet, Animated, Text, TouchableOpacity, ImageProps } from 'react-native';
export default class CollapsibleText extends Component {
    static propTypes = {
        // style: Text.propTypes.style,
        // expandTextStyle:Text.propTypes.style,
        numberOfLines: PropTypes.number,
        rawText: PropTypes.string
    }
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

    _onTextLayout(event){
        if(this.state.measureFlag){
            if(this.state.expanded){
                this.maxHeight = event.nativeEvent.layout.height;
                this.setState({expanded:false,numberOfLines:this.numberOfLines});
            }else{
                this.mixHeight = event.nativeEvent.layout.height;
                if (this.maxHeight - this.mixHeight <1){
                    this.needExpand = false;
                    this.setState({showExpandText:false,measureFlag:false})
                }else{
                    this.needExpand = true;
                    this.setState({showExpandText:true,measureFlag:false})
                }
            }
        }

    }

    _onPressExpand(){
        if(!this.state.expanded){
            this.setState({numberOfLines:null,expanded:true})
        }else{
            this.setState({numberOfLines:this.numberOfLines,expanded:false})
        }
    }

    render() {
        const { numberOfLines, onLayout, expandTextStyle, ...rest } = this.props;
        const btnTitle = this.state.expanded ? '收起' : '全部';
        const iconName = this.state.expanded ? 'e605' : 'e606';
        let expandText = this.state.showExpandText?(
            <TouchableOpacity
                onPress={this._onPressExpand.bind(this)}>
                <Text
                    style={[this.props.style,styles.expandText,expandTextStyle]}>
                    {btnTitle}
                    <Icon name={iconName} color={'#666666'} size={12} />
                </Text>
            </TouchableOpacity>
        ) : null;
        return (
            <View>
                <Text
                    numberOfLines={this.state.numberOfLines}
                    onLayout={this._onTextLayout.bind(this)}
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
