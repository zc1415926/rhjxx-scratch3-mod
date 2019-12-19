import classNames from 'classnames';
import bindAll from 'lodash.bindall';
import PropTypes from 'prop-types';
import React from 'react';
import {defineMessages, injectIntl, intlShape} from 'react-intl';

import LibraryItem from '../../containers/library-item.jsx';
import Modal from '../../containers/modal.jsx';
import Divider from '../divider/divider.jsx';
import Filter from '../filter/filter.jsx';
import TagButton from '../../containers/tag-button.jsx';
import Spinner from '../spinner/spinner.jsx';

import styles from './library.css';

//用lodash和硬编码数组模拟数据库
import _ from 'lodash';
import RhjxxGradeClassSelect from './rhjxx-grade-class-select.jsx';

const messages = defineMessages({
    filterPlaceholder: {
        id: 'gui.library.filterPlaceholder',
        defaultMessage: 'Search',
        description: 'Placeholder text for library search field'
    },
    allTag: {
        id: 'gui.library.allTag',
        defaultMessage: 'All',
        description: 'Label for library tag to revert to all items after filtering by tag.'
    }
});

const ALL_TAG = {tag: 'all', intlLabel: messages.allTag};
const tagListPrefix = [ALL_TAG];

var classList = [
    {grade: 2016, classes: [
        {classNum: '1', text: '1班', students:[
            {tag: '2016.01.01', intlLabel: {id:'grade.2016.01.01', defaultMessage:'赵'}},
            {tag: '2016.01.02', intlLabel: {id:'grade.2016.01.02', defaultMessage:'钱'}}            
        ]},
        {classNum: '2', text: '2班', students:[
            {tag: '2016.02.01', intlLabel: {id:'grade.2016.02.01', defaultMessage:'孙'}},
            {tag: '2016.02.02', intlLabel: {id:'grade.2016.02.02', defaultMessage:'李'}}
        ]}
    ]},
    {grade: 2015, classes: [
        {classNum: '3', text: '3班', students:[
            {tag: '2015.01.01', intlLabel: {id:'grade.2015.01.01', defaultMessage:'周'}},
            {tag: '2015.01.02', intlLabel: {id:'grade.2015.01.02', defaultMessage:'吴'}}
        ]},
        {classNum: '4', text: '4班', students:[
            {tag: '2015.02.01', intlLabel: {id:'grade.2015.02.01', defaultMessage:'郑'}},
            {tag: '2015.02.02', intlLabel: {id:'grade.2015.02.02', defaultMessage:'王'}}
        ]}
    ]},
    {grade: 2014, classes: [
        {classNum: '5', text: '5班', students:[
            {tag: '2014.02.01', intlLabel: {id:'grade.2014.02.01', defaultMessage:'冯'}},
            {tag: '2014.02.02', intlLabel: {id:'grade.2014.02.02', defaultMessage:'陈'}}
        ]},
        {classNum: '6', text: '6班', students:[
            {tag: '2014.02.01', intlLabel: {id:'grade.2014.02.01', defaultMessage:'楚'}},
            {tag: '2014.02.02', intlLabel: {id:'grade.2014.02.02', defaultMessage:'魏'}}
        ]}
    ]}
];

class LibraryComponent extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleClose',
            'handleFilterChange',
            'handleFilterClear',
            'handleMouseEnter',
            'handleMouseLeave',
            'handlePlayingEnd',
            'handleSelect',
            'handleTagClick',
            //这里还要加上
            //'handleGradeClick',
            //'handleClassClick',
            'setFilteredDataRef'
        ]);
        this.state = {
            playingItem: null,
            filterQuery: '',
            selectedTag: ALL_TAG.tag,
            loaded: false,
            currentGrade: 0,
            playingItem2: null,
            currentClass: 0,
            currentClasses: [],
            currentStudents: [],
            classSelectValue: '-1'
        };
    }
    componentDidMount () {
        // Allow the spinner to display before loading the content
        setTimeout(() => {
            this.setState({loaded: true});
        });
        if (this.props.setStopHandler) this.props.setStopHandler(this.handlePlayingEnd);
    }
    componentDidUpdate (prevProps, prevState) {
        if (prevState.filterQuery !== this.state.filterQuery ||
            prevState.selectedTag !== this.state.selectedTag) {
            this.scrollToTop();
        }
    }
    handleSelect (id) {
        this.handleClose();
        this.props.onItemSelected(this.getFilteredData()[id]);
    }
    handleClose () {
        this.props.onRequestClose();
    }
    handleTagClick (tag) {
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: '',
                selectedTag: tag.toLowerCase()
            });
        } else {
            this.props.onItemMouseLeave(this.getFilteredData()[[this.state.playingItem]]);
            this.setState({
                filterQuery: '',
                playingItem: null,
                selectedTag: tag.toLowerCase()
            });
        }
    } 
    
    handleStudentClick (tag) {
        if (this.state.playingItem2 === null) {
            this.setState({
                filterQuery: '',
                selectedTag: tag.toLowerCase()
            });
        } else {
            this.props.onItemMouseLeave(this.getFilteredData()[[this.state.playingItem2]]);
            this.setState({
                filterQuery: '',
                playingItem2: null,
                selectedTag: tag.toLowerCase()
            });
        }
    }
    handleMouseEnter (id) {
        // don't restart if mouse over already playing item
        if (this.props.onItemMouseEnter && this.state.playingItem !== id) {
            this.props.onItemMouseEnter(this.getFilteredData()[id]);
            this.setState({
                playingItem: id
            });
        }
    }
    handleMouseLeave (id) {
        if (this.props.onItemMouseLeave) {
            this.props.onItemMouseLeave(this.getFilteredData()[id]);
            this.setState({
                playingItem: null
            });
        }
    }
    handlePlayingEnd () {
        if (this.state.playingItem !== null) {
            this.setState({
                playingItem: null
            });
        }
    }
    handleFilterChange (event) {
        if (this.state.playingItem === null) {
            this.setState({
                filterQuery: event.target.value,
                selectedTag: ALL_TAG.tag
            });
        } else {
            this.props.onItemMouseLeave(this.getFilteredData()[[this.state.playingItem]]);
            this.setState({
                filterQuery: event.target.value,
                playingItem: null,
                selectedTag: ALL_TAG.tag
            });
        }
    }
    handleFilterClear () {
        this.setState({filterQuery: ''});
    }
    getFilteredData () {
        if (this.state.selectedTag === 'all') {
            if (!this.state.filterQuery) return this.props.data;
            return this.props.data.filter(dataItem => (
                (dataItem.tags || [])
                    // Second argument to map sets `this`
                    .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                    .concat(dataItem.name ?
                        (typeof dataItem.name === 'string' ?
                        // Use the name if it is a string, else use formatMessage to get the translated name
                            dataItem.name : this.props.intl.formatMessage(dataItem.name.props)
                        ).toLowerCase() :
                        null)
                    .join('\n') // unlikely to partially match newlines
                    .indexOf(this.state.filterQuery.toLowerCase()) !== -1
            ));
        }
        return this.props.data.filter(dataItem => (
            dataItem.tags &&
            dataItem.tags
                .map(String.prototype.toLowerCase.call, String.prototype.toLowerCase)
                .indexOf(this.state.selectedTag) !== -1
        ));
    }
    scrollToTop () {
        this.filteredDataRef.scrollTop = 0;
    }
    setFilteredDataRef (ref) {
        this.filteredDataRef = ref;
    }
    onGradeChangeHandler(e){
        //获取选择的年级
        let selectGrade = e.target.value;
        //在Json数据中找到对应年级的节点
        let classesObj = _.find(classList, (item)=>{
            return item.grade == selectGrade;
        })

        this.setState({
            //当前选择的年级：刚刚单击的选择的年级
            currentGrade: selectGrade,
            //当前的班级：年级节点中的班级数组
            currentClasses: classesObj.classes,
            //每次年级改变后，将班级select控件选择的项设为-1，即“请选择班级”
            classSelectValue:'-1'
        });
    }
    onClassChangeHandler(e){
        //获取选择的班级
        let selectClass = e.target.value;
        //输出年级、班级
        //console.log(this.state.currentGrade)
        //console.log(selectClass)
        
        //在班级数据中找到选择的班级的结点
        var studentsObj = _.find(this.state.currentClasses, (item)=>{
            return item.classNum == selectClass;
        })

        this.setState({
            //保存找到的学生信息到state
            currentStudents: studentsObj.students,
            //将班级select组件显示的值设为单击的那个（因为有指定班级select组件默认值的程序
            //所以这里要加入改变值的程序）
            classSelectValue:e.target.value})
    }
    render () {        
        return (
            <Modal
                fullScreen
                contentLabel={this.props.title}
                id={this.props.id}
                onRequestClose={this.handleClose}
            >
                {(this.props.filterable || this.props.tags) && (
                    <div className={styles.filterBar}>                        
                        {this.props.filterable && this.props.tags && (
                            <Divider className={classNames(styles.filterBarItem, styles.divider)} />
                        )}
                        {
                            //这里插入两个自定义select，一个是选年级，一个是选班级
                            <>
                                <RhjxxGradeClassSelect />
                                
                            </>
                        }
                    </div>
                )}
                {
                    //下边新起一个filterBar放学生的名字tag
                    //TODO:filterBar的宽窄可以根据tag的多少来调整
                }
                
                <div className={styles.filterBar}
                style={{height: '11rem','backgroundColor': 'rgb(39, 80, 139)'}}>
                {
                    <div className={styles.tagWrapper}
                    style={{height: '11rem'}}>
                        {
                            this.state.currentStudents.length ==0?<div></div>:
                            this.state.currentStudents.map((tagProps, id) => (
                            <TagButton
                                active={this.state.selectedTag === tagProps.tag.toLowerCase()}
                                className={classNames(
                                    styles.filterBarItem,
                                    styles.tagButton,
                                    tagProps.className
                                )}
                                key={`tag-button-${id}`}
                                onClick={(e)=>this.handleStudentClick(e)}
                                {...tagProps}
                            />
                        ))}
                    </div>            
                }
                </div>
                <div
                    className={classNames(styles.libraryScrollGrid, {
                        [styles.withFilterBar]: this.props.filterable || this.props.tags
                    })}
                    ref={this.setFilteredDataRef}
                >
                    {this.state.loaded ? this.getFilteredData().map((dataItem, index) => (
                        <LibraryItem
                            bluetoothRequired={dataItem.bluetoothRequired}
                            collaborator={dataItem.collaborator}
                            description={dataItem.description}
                            disabled={dataItem.disabled}
                            extensionId={dataItem.extensionId}
                            featured={dataItem.featured}
                            hidden={dataItem.hidden}
                            iconMd5={dataItem.md5}
                            iconRawURL={dataItem.rawURL}
                            icons={dataItem.json && dataItem.json.costumes}
                            id={index}
                            insetIconURL={dataItem.insetIconURL}
                            internetConnectionRequired={dataItem.internetConnectionRequired}
                            isPlaying={this.state.playingItem === index}
                            key={typeof dataItem.name === 'string' ? dataItem.name : dataItem.rawURL}
                            name={dataItem.name}
                            showPlayButton={this.props.showPlayButton}
                            onMouseEnter={this.handleMouseEnter}
                            onMouseLeave={this.handleMouseLeave}
                            onSelect={this.handleSelect}
                        />
                    )) : (
                        <div className={styles.spinnerWrapper}>
                            <Spinner
                                large
                                level="primary"
                            />
                        </div>
                    )}
                </div>
            </Modal>
        );
    }
}

LibraryComponent.propTypes = {
    data: PropTypes.arrayOf(
        /* eslint-disable react/no-unused-prop-types, lines-around-comment */
        // An item in the library
        PropTypes.shape({
            // @todo remove md5/rawURL prop from library, refactor to use storage
            md5: PropTypes.string,
            name: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.node
            ]),
            rawURL: PropTypes.string
        })
        /* eslint-enable react/no-unused-prop-types, lines-around-comment */
    ),
    filterable: PropTypes.bool,
    id: PropTypes.string.isRequired,
    intl: intlShape.isRequired,
    onItemMouseEnter: PropTypes.func,
    onItemMouseLeave: PropTypes.func,
    onItemSelected: PropTypes.func,
    onRequestClose: PropTypes.func,
    setStopHandler: PropTypes.func,
    showPlayButton: PropTypes.bool,
    tags: PropTypes.arrayOf(PropTypes.shape(TagButton.propTypes)),
    title: PropTypes.string.isRequired
};

LibraryComponent.defaultProps = {
    filterable: true,
    showPlayButton: false
};

export default injectIntl(LibraryComponent);
