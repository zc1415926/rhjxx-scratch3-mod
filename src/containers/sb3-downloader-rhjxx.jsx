import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import {projectTitleInitialState} from '../reducers/project-title';
//import downloadBlob from '../lib/download-blob';
import axios from 'axios';
/**
 * Project saver component passes a downloadProject function to its child.
 * It expects this child to be a function with the signature
 *     function (downloadProject, props) {}
 * The component can then be used to attach project saving functionality
 * to any other component:
 *
 * <SB3DownloaderRhjxx>{(downloadProject, props) => (
 *     <MyCoolComponent
 *         onClick={downloadProject}
 *         {...props}
 *     />
 * )}</SB3DownloaderRhjxx>
 */
class SB3DownloaderRhjxx extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'downloadProject'
        ]);
    }
    postToServer(fileReader){        
        axios.post('http://localhost:2222/scratch-file', {
            fileName: this.props.projectFilename,
            fileData: fileReader.result
        })
            .then(function (response) {
                console.log('接收post的返回消息')
                console.log(response)
            })
            .catch(function (error) {
                if(error){
                    throw error;
                }
            });
    }

    downloadProject () {
        this.props.saveProjectSb3().then(content => {
            if (this.props.onSaveFinished) {
                this.props.onSaveFinished();
            }
            
            // Scratch3中输入的文件名：this.props.projectFilename
            // 文件数据的blob格式：content
            //var fileName = this.props.projectFilename
            var fileReader = new FileReader();

            //当数据读取完成后，发送到服务器
            //onloadend的回调函数有一个event参数，想把它指定到class中的另一个函数，要有一个e参数占位，不然就会传错参数
            //箭头函数的写法参照了：https://blog.csdn.net/qq_35772366/article/details/79430073
            fileReader.onloadend = (e)=>this.postToServer(fileReader);

            //blob转换成base64数据，http://www.fly63.com/article/detial/4309
            fileReader.readAsDataURL(content)           
        });
    }
    render () {
        const {
            children
        } = this.props;
        return children(
            this.props.className,
            this.downloadProject
        );
    }
}

const getProjectFilename = (curTitle, defaultTitle) => {
    let filenameTitle = curTitle;
    if (!filenameTitle || filenameTitle.length === 0) {
        filenameTitle = defaultTitle;
    }
    return `${filenameTitle.substring(0, 100)}.sb3`;
};

SB3DownloaderRhjxx.propTypes = {
    children: PropTypes.func,
    className: PropTypes.string,
    onSaveFinished: PropTypes.func,
    projectFilename: PropTypes.string,
    saveProjectSb3: PropTypes.func
};
SB3DownloaderRhjxx.defaultProps = {
    className: ''
};

const mapStateToProps = state => ({
    saveProjectSb3: state.scratchGui.vm.saveProjectSb3.bind(state.scratchGui.vm),
    projectFilename: getProjectFilename(state.scratchGui.projectTitle, projectTitleInitialState)
});

export default connect(
    mapStateToProps,
    () => ({}) // omit dispatch prop
)(SB3DownloaderRhjxx);
