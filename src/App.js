import React from 'react';
//import logo from './logo.svg';
import Navbar from "./components/Navbar";
import Pagination from "./components/Pagination";
//import Divider from "./components/Divider";
//import Footer from "./components/Footer";
//import BulmaComponeTry from "./components/BulmaComponeTry";
import './App.scss';

//import { BrowserRouter, Route } from "react-router-dom";
import GithubUser from './GithubUser';
import Following from './Following';

import axios from 'axios';
import { API, USER_PER_PG } from './defaults';

/**
 * @description this is the main component of the react structure and includes the state of the app
 * in a particular time and logic of the app in terms of functions that performs the data fetching
 */
class App extends React.Component {
  constructor() {
    super();

    /** 
     * @description state of the app is used to keep the current page with the list of users fetched
     * @param {string} users is the JSON data in a array the promise returns
     * @param {number} userPage is the number for pagination, init value 1 for the first page
    */
    this.state = {
      users: [],
      userPage: 1
    };
    this.handleNextPageClick=this.handleNextPageClick.bind(this);
    this.handlePrevPageClick=this.handlePrevPageClick.bind(this);
    this.handlePageClick=this.handlePageClick.bind(this);
  }

  componentWillMount() {

    this.searchUsers();
    //console.log(this.state.users)
    
  }

  handleNextPageClick () {

    const nextPageNum=this.state.userPage + 1;
    //async
    this.setState({ userPage: nextPageNum });
    //async
    this.searchUsers( nextPageNum );
  }

  handlePrevPageClick () {

    const prevPageNum=this.state.userPage - 1;
    //async
    this.setState({ userPage: prevPageNum });
    //async
    this.searchUsers( prevPageNum );
  }

  handlePageClick (event) {

    const eveTargId=Number(event.target.id);
    //async
    this.setState({ userPage: eveTargId });
    //async
    this.searchUsers( eveTargId );
  }

  /**
 * @description Github API call with query params in it to fetch users Javascripters
 * from the Github with popularity as a base factor according the number of followers.
 * @function searchUsers use axios library in order to call the api and return a promise on resolve
 * @todo manage to chain this function with the the getUserDetails so that to have user details data ready
 * @param {number} userPage is the number for the pagination in the site, on missing value then passing userPage=1 for default value
 * to the function explicitly, use the setState to change page instead
 * @example https://api.github.com/search/users?q=language:javascript+type:user&sort=followers&order=desc&page=1&per_page=10
 */
  searchUsers = function (userPage=1) {
      //Default function parameters allow named parameters to be initialized with default values if no value or undefined is passed
     //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Default_parameters
    //if (userPage === undefined) {userPage=1} //when func invoked without value then init of user page at number 1
    const find = '/search/users';
    axios.get(`${API}${find}?q=language:javascript+type:user&sort=followers&order=desc&page=${userPage}&per_page=${USER_PER_PG}`)
      .then( (response) => {
        //console.dir(response.data.items[0].login)
        this.setState({users: response.data.items}); //this.state.users.map((user) => ({'login':user.login})); console.log(this.state.users);
      }).catch( (error) => {
        console.error("Error on fetching Github users:" + error);
        window.alert("Sorry, there is a malfunction on fetching Github Javascripters!");
      })
  }

  render() {
    //console.log(this.state.users);

    return (
      <React.Fragment>
        <Navbar
        spaced={true}
        logo="https://bulma.io/images/bulma-logo.png"
        logoWidth={112}
        logoHeight={28}
        />

        { this.state.users
            .map(( user ) => ({ 'avatar_url' :  user.avatar_url,                
                                'id' : user.id,
                                'login' : user.login }) )
                                  .map(( user ) => ( <GithubUser {...user} key={user.id} /> )) }

        <Pagination userPage={this.state.userPage}
              handleNextPageClick={this.handleNextPageClick}
              handlePrevPageClick={this.handlePrevPageClick}
              handlePageClick={this.handlePageClick} />

        <Following />
      </React.Fragment>
    );
  }
}

export default App;
