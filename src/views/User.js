import React, { Component } from "react";
import { Link } from "react-router-dom";

import CommentList from "../components/User/CommentList";
import ItemList from "../components/User/ItemList";

import "../static/views/User.css";

import UserService from "../services/UserService";
import SubjectService from "../services/SubjectService";
let userService = UserService.getInstance();
let subjectService = SubjectService.getInstance();

class User extends Component {
  constructor(props) {
    super(props);
    this.state = {
      country: "",
      displayName: "",
      userId: null,
      pageId: props.match.params.id,
      isMyself: false,
      isLoggedIn: false,
      photo: "",
      comments: [],
      albumLikes: [],
      artistLikes: [],
      trackLikes: [],
      commentLikes: [],
      loaded: 0, 
      following: false, //current user in session is following the user page or not
      followers: [],     //someone who is following the user page
      followees: []
    };
  }
  toggleFollowUser=()=>{ //follow or unfollow user, better than toggling since it always gives user a correct in case of user async
    if(this.state.following===false){ 
    userService.followUser(this.props.match.params.id).then(
      res=>this.setState( {following:!this.state.following} ) ).catch(err=>
        this.setState({following: null })//show err on button to imply user to refresh
      ).then( ()=>{
        userService.findFollowersById(this.props.match.params.id).then(res=> this.setState({followers:res})).catch(
          err=>this.setState({followers:null})  //to show  to imply user to refresh
        )
      })
    }

    else if(this.state.following===true){
      userService.unfollowUser(this.props.match.params.id).then(
        res=>this.setState( {following:!this.state.following} ) ).catch(err=>
          this.setState({following: null } ) )//show err on button to imply user to refresh
          .then( ()=>{
            userService.findFollowersById(this.props.match.params.id).then(res=> this.setState({followers:res})).catch(
              err=>this.setState({followers:null})  //to show  to imply user to refresh
            )
          })
        }
      
    }
  
  componentWillReceiveProps(nextProps){
    this.state={
      country: "",
      displayName: "",
      userId: null,
      pageId: nextProps.match.params.id,
      isMyself: false,
      isLoggedIn: false,
      photo: "",
      comments: [],
      albumLikes: [],
      artistLikes: [],
      trackLikes: [],
      commentLikes: [],
      loaded: 0, 
      following: false, //current user in session is following the user page or not
      followers: [],     //someone who is following the user page
      followees: []
    }

    userService.findFollowersById(nextProps.match.params.id).then(res=> this.setState({followers:res})).catch(
      err=>this.setState({followers:null})  //to show  to imply user to refresh
    )

    userService.findFolloweesById(nextProps.match.params.id).then(res=> this.setState({followees:res}) ).catch(
      err=>this.setState({followees:null})  // show  to imply user to refresh
     ) 

    userService.checkFollowing(nextProps.match.params.id).then(res=>
      this.setState( {following:res.following} )).catch(  err=>
        this.setState({following: null }) )

    userService.getCurrentUser().then(user => {
      // user loggedin and it's the user's page
      if (user._id !== -1 && user._id === nextProps.match.params.id) {
        console.log("myself");
        this.setState({
          isLoggedIn: true,
          isMyself: true
        });
        // user loggedin but it's not the user's page
      } else if (user._id !== -1 && user._id !== nextProps.match.params.id) {
        this.setState({
          isLoggedIn: true
        });
      }
      // find user profile by id
      userService.findUserById(nextProps.match.params.id).then(user => {
        console.log("others");
        this.setState({
          userId: user._id,
          displayName: user.displayName,
          photo: user.photo,
          country: user.country,
          bio: user.bio,
          loaded: this.state.loaded + 1
        });
      });
      subjectService
        .findCommentsByUserId(nextProps.match.params.id)
        .then(comments => {
          // console.log(comments);
          this.setState({
            comments,
            loaded: this.state.loaded + 1
          });
        });
      subjectService
        .findCommentLikesByUserId(nextProps.match.params.id)
        .then(commentLikes => {
          var comments = [];
          for (var i = 0; i < commentLikes.length; i++) {
            comments.push(commentLikes[i].comment);
          }
          console.log(comments);
          this.setState({
            commentLikes: comments,
            loaded: this.state.loaded + 1
          });
        });
      subjectService
        .findSubjectLikesByUserId(nextProps.match.params.id)
        .then(subjectLikes => {
          for (var i = 0; i < subjectLikes.length; i++) {
            if (subjectLikes[i].subject.type === "album") {
              this.state.albumLikes.push(subjectLikes[i]);
            } else if (subjectLikes[i].subject.type === "artist") {
              this.state.artistLikes.push(subjectLikes[i]);
            } else if (subjectLikes[i].subject.type === "track") {
              this.state.trackLikes.push(subjectLikes[i]);
            }
          }
          console.log(subjectLikes);
          this.setState({
            loaded: this.state.loaded + 1
          });
        });
    });

  }
  componentDidMount() { //we had better load info async for user experience
    userService.findFollowersById(this.props.match.params.id).then(res=> this.setState({followers:res})).catch(
      err=>this.setState({followers:null})  //to show  to imply user to refresh
    )

    userService.findFolloweesById(this.props.match.params.id).then(res=> this.setState({followees:res}) ).catch(
      err=>this.setState({followees:null})  // show  to imply user to refresh
     ) 

    userService.checkFollowing(this.props.match.params.id).then(res=>
      this.setState( {following:res.following} )).catch(  err=>
        this.setState({following: null }) )

    userService.getCurrentUser().then(user => {
      // user loggedin and it's the user's page
      if (user._id !== -1 && user._id === this.props.match.params.id) {
        console.log("myself");
        this.setState({
          isLoggedIn: true,
          isMyself: true
        });
        // user loggedin but it's not the user's page
      } else if (user._id !== -1 && user._id !== this.props.match.params.id) {
        this.setState({
          isLoggedIn: true
        });
      }
      // find user profile by id
      userService.findUserById(this.props.match.params.id).then(user => {
        console.log("others");
        this.setState({
          userId: user._id,
          displayName: user.displayName,
          photo: user.photo,
          country: user.country,
          bio: user.bio,
          loaded: this.state.loaded + 1
        });
      });
      subjectService
        .findCommentsByUserId(this.props.match.params.id)
        .then(comments => {
          // console.log(comments);
          this.setState({
            comments,
            loaded: this.state.loaded + 1
          });
        });
      subjectService
        .findCommentLikesByUserId(this.props.match.params.id)
        .then(commentLikes => {
          var comments = [];
          for (var i = 0; i < commentLikes.length; i++) {
            comments.push(commentLikes[i].comment);
          }
          console.log(comments);
          this.setState({
            commentLikes: comments,
            loaded: this.state.loaded + 1
          });
        });
      subjectService
        .findSubjectLikesByUserId(this.props.match.params.id)
        .then(subjectLikes => {
          for (var i = 0; i < subjectLikes.length; i++) {
            if (subjectLikes[i].subject.type === "album") {
              this.state.albumLikes.push(subjectLikes[i]);
            } else if (subjectLikes[i].subject.type === "artist") {
              this.state.artistLikes.push(subjectLikes[i]);
            } else if (subjectLikes[i].subject.type === "track") {
              this.state.trackLikes.push(subjectLikes[i]);
            }
          }
          console.log(subjectLikes);
          this.setState({
            loaded: this.state.loaded + 1
          });
        });
    });
  }

  deleteComment = commentId => {
    subjectService.deleteComment(commentId).then(() => {
      subjectService
        .findCommentsByUserId(this.props.match.params.id)
        .then(comments => {
          this.setState({ comments });
        });

      subjectService
        .findCommentLikesByUserId(this.props.match.params.id) //commentLikes has a different nested json structure
        .then(commentLikes => {
          var comments = [];
          for (var i = 0; i < commentLikes.length; i++) {
            comments.push(commentLikes[i].comment);
          }
          console.log(comments);
          this.setState({
            commentLikes: comments
          });
        });
    });
  };

  render() {
    console.log("followees",this.state.followees)
    console.log("followers",this.state.followers)
    return (
      this.state.loaded === 4 && (
        <div className="container">
          <div className="row user-content mt-3">
            <div className="col">
              <div className="row">
                <div className="col-auto profile-image">
                  <img
                    alt="img"
                    className="img-fluid"
                    src={
                      this.state.photo === ""
                        ? "https://northmemorial.com/wp-content/uploads/2016/10/PersonPlaceholder.png"
                        : this.state.photo
                    }
                  />
                </div>
                <div className="col">
                  <div className="row">
                    <div className="col">
                      <h2 className="displayName my-1">
                        {this.state.displayName}
                      </h2>
                      <div className="bio my-1">
                        <i className="fas fa-compact-disc" /> {this.state.bio}
                      </div>
                      <div className="location my-1">
                        <i className="fas fa-map-marker-alt" />{" "}
                        {this.state.country}
                      </div>
                      <div className="follow-count my-1">
                        Comments: {this.state.comments.length} Likes:{" "}
                        {this.state.albumLikes.length +
                          this.state.artistLikes.length +
                          this.state.trackLikes.length}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row my-3">
                {this.state.isMyself === false &&
                this.state.isLoggedIn === true ? (
                  <div className="col-auto">
                    <button
                      type="button"
                      className="btn btn-light mt-2"
                      onClick={this.toggleFollowUser}
                    >
                  {(function(state) {
        switch(true) {
          case state.following===true:
            return <div> <i className="fas fa-minus" /> Unfollow</div>;
          case state.following===false:
            return <div> <i className="fas fa-plus" /> Follow</div>;
          default:
            return <div> <i className="fas fa-times" /> Error, refresh</div>;
        }
      })( this.state)}
                    </button>
                  </div>
                ) : null}
                {this.state.isMyself === true ? (
                  <div className="col-auto">
                    <Link
                      to="/profile"
                      className="btn btn-light  mt-2"
                      onClick={this.editProfileHandler}
                    >
                      <i className="fas fa-user-edit" /> Edit Profile
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
          
          <div id="followers">
            <div className="row mt-2">
              <div className="col">
                <span>Followed By</span>
              </div>
            </div>
            <hr className="user-hr" />
            <div className="row m-2">
            { this.state.followers ? this.state.followers.map( (follower)=>
            <div>
            {follower.follower? //follower found in database (or not)
            <div>
            <span style={{whiteSpace:"nowrap", marginTop:"3px"}}> &middot;<Link to={"/profile/"+follower.follower._id}>{follower.follower.displayName}</Link>&nbsp;
            <img src={follower.follower.photo} width="25px" height="25px"></img>
            </span>
</div>
            
            :null} 
            </div>) 
            :  <div>Cannot get followers, try refresh</div>}
            </div>
          </div>

          <div id="followees">
            <div className="row mt-2">
              <div className="col">
                <span>Following</span>
              </div>
            </div>
            <hr className="user-hr" />
            <div className="row m-2">
            { this.state.followees ? this.state.followees.map(followee=>
            followee.followee?
            <span style={{whiteSpace:"nowrap", marginTop:"3px"}}>  &middot;<Link to={"/profile/"+followee.followee._id}>{followee.followee.displayName}</Link> &nbsp;
            <img src={followee.followee.photo} width="25px" height="25px"></img>
            </span>
            
            :null ) 
            :  <div>Cannot get followees, try refresh</div>}
            </div>
          </div>
          
          <div id="my-comments">
            <div className="row mt-2">
              <div className="col">
                <span>My Comments</span>
              </div>
            </div>
            <hr className="user-hr" />
            <div className="row m-2">
              <CommentList
                comments={this.state.comments}
                deleteComment={this.deleteComment}
                isMyself={this.state.isMyself}
              />
            </div>
          </div>

          <div id="comment-likes">
            <div className="row mt-2">
              <div className="col">
                <span>Favorite Comments</span>
              </div>
            </div>
            <hr className="user-hr" />
            <div className="row m-2">
              <CommentList comments={this.state.commentLikes} />
            </div>
          </div>

          <div id="album-likes">
            <div className="row mt-2">
              <div className="col">
                <span>Album Likes</span>
              </div>
            </div>
            <hr className="user-hr" />
            <div className="row m-2">
              <ItemList subjectLikes={this.state.albumLikes} />
            </div>
          </div>

          <div id="artist-likes">
            <div className="row mt-2">
              <div className="col">
                <span>Artist Likes</span>
              </div>
            </div>
            <hr className="user-hr" />
            <div className="row m-2">
              <ItemList subjectLikes={this.state.artistLikes} />
            </div>
          </div>

          <div id="track-likes">
            <div className="row mt-2">
              <div className="col">
                <span>Track Likes</span>
              </div>
            </div>
            <hr className="user-hr" />
            <div className="row m-2">
              <ItemList subjectLikes={this.state.trackLikes} />
            </div>
          </div>


        </div>

        
      )
    );
  }
}

export default User;
