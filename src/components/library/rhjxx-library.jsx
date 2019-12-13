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
var tagListGrades = [
    {tag: '2016', intlLabel: {id:'grade.2016', defaultMessage:'2016级'}},
    {tag: '2015', intlLabel: {id:'grade.2015', defaultMessage:'2015级'}},
    {tag: '2014', intlLabel: {id:'grade.2014', defaultMessage:'2014级'}}
];

var tagListClasses = [
    {grade: 2016, classes: [
        {tag: '2016.01', intlLabel: {id:'grade.2016.01', defaultMessage:'2016级1班'}},
        {tag: '2016.02', intlLabel: {id:'grade.2016.02', defaultMessage:'2016级2班'}}
    ]},
    {grade: 2015, classes: [
        {tag: '2015.03', intlLabel: {id:'grade.2015.03', defaultMessage:'2015级3班'}},
        {tag: '2015.04', intlLabel: {id:'grade.2015.04', defaultMessage:'2015级4班'}}
    ]},
    {grade: 2014, classes: [
        {tag: '2014.05', intlLabel: {id:'grade.2014.05', defaultMessage:'2014级5班'}},
        {tag: '2014.06', intlLabel: {id:'grade.2014.06', defaultMessage:'2014级6班'}}
    ]},
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
            'handleGradeClick',
            'handleClassClick',
            'setFilteredDataRef'
        ]);
        this.state = {
            playingItem: null,
            filterQuery: '',
            selectedTag: ALL_TAG.tag,
            loaded: false,
            //currentGrade: {},
            playingItem2: null,
            currentClass: []
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
    handleGradeClick (tag) {
        console.log('handleGradeClick!');
        console.log(tag);
        var returnValue = _.find(tagListClasses, (item)=>{
            console.log('item');
            console.log(item);
            return item.grade == tag;
        })
        //console.log('returnValue');
        //console.log(returnValue);
        this.setState({currentClass: returnValue.classes});

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
    handleClassClick (tag) {
        console.log('handleClassClick');
        console.log(tag);
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
                        {this.props.filterable && (
                            <Filter
                                className={classNames(
                                    styles.filterBarItem,
                                    styles.filter
                                )}
                                filterQuery={this.state.filterQuery}
                                inputClassName={styles.filterInput}
                                placeholderText={this.props.intl.formatMessage(messages.filterPlaceholder)}
                                onChange={this.handleFilterChange}
                                onClear={this.handleFilterClear}
                            />
                        )}
                        {this.props.filterable && this.props.tags && (
                            <Divider className={classNames(styles.filterBarItem, styles.divider)} />
                        )}
                        {
                            /**这里改编了选年级的代码 */
                            //this.props.tags &&
                            <div className={styles.tagWrapper}>
                                {tagListGrades.map((tagProps, id) => (
                                    <TagButton
                                        active={this.state.selectedTag === tagProps.tag.toLowerCase()}
                                        className={classNames(
                                            styles.filterBarItem,
                                            styles.tagButton,
                                            tagProps.className
                                        )}
                                        key={`tag-button-${id}`}
                                        onClick={this.handleGradeClick}
                                        {...tagProps}
                                    />
                                ))}
                            </div>
                        }
                        {<div></div>/*        this.props.tags &&
                            <div className={styles.tagWrapper}>
                                {tagListPrefix.concat(this.props.tags).map((tagProps, id) => (
                                    <TagButton
                                        active={this.state.selectedTag === tagProps.tag.toLowerCase()}
                                        className={classNames(
                                            styles.filterBarItem,
                                            styles.tagButton,
                                            tagProps.className
                                        )}
                                        key={`tag-button-${id}`}
                                        onClick={this.handleTagClick}
                                        {...tagProps}
                                    />
                                ))}
                            </div>*/
                        }
                    </div>
                )}
                
                <div className={styles.filterBar}>
                {
                    /**这里改编了选班级的代码 */
                    //this.props.tags &&
                    <div className={styles.tagWrapper}>
                        {this.state.currentClass.map((tagProps, id) => (
                            <TagButton
                                active={this.state.selectedTag === tagProps.tag.toLowerCase()}
                                className={classNames(
                                    styles.filterBarItem,
                                    styles.tagButton,
                                    tagProps.className
                                )}
                                key={`tag-button-${id}`}
                                onClick={this.handleTagClick}
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
