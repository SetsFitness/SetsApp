import React, { Component } from 'react';
import { Label, Grid, Icon } from 'semantic-ui-react'
import {fetchUserAttributes, forceFetchUserAttributes} from "../../redux_helpers/actions/userActions";
import connect from "react-redux/es/connect/connect";
import {Player} from "video-react";

export default (props: {message: any, userID: string}) => {
    const from = props.message.from;
    const name = props.message.name;
    const message = props.message.message;
    const messageURL = props.message.messageURL;
    const profilePicture = props.message.profilePicture;
    const type = props.message.type;
    const ifSelf = from === props.userID;
    if (type) {
        // Image or video message
        if (type === "picture") {
            if (ifSelf) {
                // Self picture
                return (
                    <Grid class="ui computer vertically reversed equal width grid">
                        <Label className='ui right fluid' pointing='right' color='purple'>
                            <div className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4"
                                 style={{backgroundImage: `url(${messageURL})`}}>
                                <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                                    <Icon name="upload" className='u-margin-right--0' size="large" inverted/>
                                </Label>
                                <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true}
                                       onChange={this.setPicture}/>
                            </div>
                        </Label>
                        <Grid.Column width={6}>
                            <div avatar align="center" className="ui u-avatar tiny" style={{backgroundImage: `url(${profilePicture})`, width: '50px', height: '50px'}}></div>
                        </Grid.Column>
                    </Grid>
                );
            }
            else {
                // Other picture
                return (
                    <Grid class="ui computer vertically reversed equal width grid">
                        <Grid.Column width={6}>
                            <div avatar align="center" className="ui u-avatar tiny" style={{backgroundImage: `url(${profilePicture})`, width: '50px', height: '50px'}}></div>
                        </Grid.Column>
                        <Label className='ui left fluid' pointing='left'>
                            <div className="u-avatar u-avatar--large u-margin-x--auto u-margin-top--neg4"
                                 style={{backgroundImage: `url(${messageURL})`}}>
                                <Label as="label" htmlFor="proPicUpload" circular className="u-bg--primaryGradient">
                                    <Icon name="upload" className='u-margin-right--0' size="large" inverted/>
                                </Label>
                                <input type="file" accept="video/*;capture=camcorder" id="proPicUpload" hidden={true}
                                       onChange={this.setPicture}/>
                            </div>
                        </Label>
                    </Grid>
                );
            }
        }
        else if (type === "video") {
            if (ifSelf) {
                // Self video
                return (
                    <Grid class="ui computer vertically reversed equal width grid">
                        <Label className='ui right fluid' pointing='right' color='purple'>
                            <Player>
                                <source src={messageURL} type="video/mp4"/>
                            </Player>
                        </Label>
                        <Grid.Column width={6}>
                            <div avatar align="center" className="ui u-avatar tiny" style={{backgroundImage: `url(${profilePicture})`, width: '50px', height: '50px'}}></div>
                        </Grid.Column>
                    </Grid>
                );
            }
            else {
                // Other video
                return (
                    <Grid class="ui computer vertically reversed equal width grid">
                        <Grid.Column width={6}>
                            <div avatar align="center" className="ui u-avatar tiny" style={{backgroundImage: `url(${profilePicture})`, width: '50px', height: '50px'}}></div>
                        </Grid.Column>
                        <Label className='ui left fluid' pointing='left'>
                            <Player>
                                <source src={messageURL} type="video/mp4"/>
                            </Player>
                        </Label>
                    </Grid>
                );
            }
        }
        else {
            alert("Unrecognized message type = " + type);
        }
    }
    else {
        // Normal message
        if (ifSelf) {
            // Self text
            return (
                <Grid>
                    <Grid.Column floated='right' width={10}>
                        <div>
                            <Label pointing='right' size='large' color='purple'>
                                {message}
                            </Label>
                            <strong>{name}</strong>
                        </div>
                    </Grid.Column>
                    <Grid.Column width={6}>
                        <div avatar align="center" className="ui u-avatar tiny" style={{backgroundImage: `url(${profilePicture})`, width: '50px', height: '50px'}}></div>
                    </Grid.Column>
                </Grid>
            );
        }
        else {
            // Other text
            return (
                <Grid style={{marginLeft: '10px'}}>
                    <Grid.Column width={6}>
                        <div avatar align="center" className="ui u-avatar tiny" style={{backgroundImage: `url(${profilePicture})`, width: '50px', height: '50px'}}></div>
                    </Grid.Column>
                    <Grid.Column floated='left' width={10}>
                        <div>
                            <strong>{name}</strong>
                            <Label pointing='left' size='large'>
                                {message}
                            </Label>
                        </div>
                    </Grid.Column>
                </Grid>
            );
        }
    }
}
