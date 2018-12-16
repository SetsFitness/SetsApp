import React, { Component, Fragment } from 'react';
import {Button, Input, Grid, Label, Icon} from "semantic-ui-react";
import { Storage } from 'aws-amplify';
import {fetchUserAttributes, forceFetchUserAttributes} from "../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";
import Lambda from "../Lambda";
import defaultProfilePicture from "../img/roundProfile.png";

class CommentBox extends Component {
    state = {
        imagePath: '',
        imageURL: '',
        sentRequest: false,
        canAddImage: true
    };

    constructor(props) {
        super(props);
        this.addComment = this.addComment.bind(this);
        this.addPicOrVid = this.addPicOrVid.bind(this);
        this.setPicture = this.setPicture.bind(this);
    }

    componentWillReceiveProps(newProps) {
        if (newProps.user && this.props.user && newProps.user.id !== this.props.user.id) {
            this.resetState();
        }
        //alert("Comment User: " + JSON.stringify(this.props));
    }

    addComment(e) {
        // Prevent the default behaviour of form submit
        e.preventDefault();

        // Get the value of the comment box
        // and make sure it not some empty strings
        let comment = e.target.elements.comment.value.trim();
        //let name = this.props.user.username;
        let name = this.props.curUser;

        //alert(name);

        // Make sure name and comment boxes are filled
        if (comment) {
            //alert(name);
            const commentObject = { name, comment };

            this.props.handleAddComment(commentObject);

            // Publish comment
            /*global Ably*/
            //alert(this.props.challengeChannel);
            const channel = Ably.channels.get(this.props.challengeChannel);
            channel.publish('add_comment', commentObject, err => {
                if (err) {
                    console.log('Unable to publish message; err = ' + err.message);
                }
            });

            // Clear input fields
            e.target.elements.comment.value = '';
        }
    }

    addPicOrVid(path) {
        // Get the value of the comment box
        // and make sure it not some empty strings
        let comment = path;
        //let name = this.props.user.username;
        let name = this.props.curUser;

        //alert(name);
        //alert(name);
        const commentObject = { name, comment };

        this.props.handleAddComment(commentObject);

        // Publish comment
        /*global Ably*/
        //alert(this.props.challengeChannel);
        const channel = Ably.channels.get(this.props.challengeChannel);
        channel.publish('add_comment', commentObject, err => {
            alert("Added Comment: " + commentObject.comment);
            if (err) {
                console.log('Unable to publish message; err = ' + err.message);
            }
        });
    }

    setPicture(event) {
        //alert(JSON.stringify(this.props));
        //alert(this.props.curUserID);
        if (this.props.curUserID) {
            const path = "/ClientFiles/" + this.props.curUserID + "/" + Math.floor((Math.random() * 10000000000000) + 1);

            Storage.put(path, event.target.files[0], { contentType: "video/*;image/*" }).then((result) => {
                this.setState({imagePath: path});
                this.setState({isLoading: true});
            }).catch((error) => {
                alert("failed storage put");
                alert(error);
            });

            //alert("Calling storage put");
            //alert("File = " + JSON.stringify(event.target.files[0]));
        }
    }



    render() {
        if(this.state.imageURL && this.state.canAddImage) {
            alert("Image URL found: " + this.state.imageURL);
            this.addPicOrVid(this.state.path);
            this.setState({canAddImage: false});
        }
        return (
            <Fragment>
                
                <form onSubmit={this.addComment} className='u-margin-top--3'>
                    <Input fluid className="textarea" name="comment" placeholder="Write Message..."></Input>
                    <Button primary className="u-margin-top--2">Send</Button>
                </form>
                <div className="uploadImage u-flex u-flex-align--center u-margin-top--2">
                    <div>
                        <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                            <Icon name="camera" className='u-margin-right--0' size="large" inverted />
                        </Label>
                        <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true} onChange={this.setPicture}/>
                    </div>
                    <span>Upload video</span>
                </div>
            </Fragment>
        );
    }
}

export default CommentBox;