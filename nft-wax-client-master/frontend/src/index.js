import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom';
import 'tailwindcss/tailwind.css';
import axios from 'axios';
import dotenv from 'dotenv';
import { UALProvider, withUAL } from 'ual-reactjs-renderer';
import { Wax } from '@eosdacio/ual-wax';

import AuthenticationContext from './components/context/Authentication';
import ModalContext from './components/context/Modal';

import Login from './pages/Login';
import Stories from './pages/Stories';
import MyAssets from './pages/MyAssets';
import FullStory from './pages/FullStory';
import AddStory from './pages/AddStory';
import AddLoginBanner from './pages/AddLoginBanner'

import DashboardLayout from './components/DashboardLayout';
import AdminStories from './pages/AdminStories';
import AdminEditStory from './pages/AdminEditStory';

import ManageAdmins from './pages/ManageAdmins';

dotenv.config();

axios.defaults.baseURL = process.env.REACT_APP_API_URL;
axios.defaults.headers.common['Authorization'] = '';
axios.defaults.headers.post['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  (request) => {
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const MyApp = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [userAccount, setUserAccount] = useState('');
  const [token, setToken] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    if (props.ual.activeUser !== null) {
      if (props.ual.activeUser.accountName !== null) {
        axios
          .post('/login', { username: props.ual.activeUser.accountName })
          .then((res) => {
            axios.defaults.headers.common['Authorization'] = res.data.token;
            axios.interceptors.response.use(
              (response) => {
                console.log(response);
                return response;
              },
              (error) => {
                console.log(error);
                return Promise.reject(error);
              }
            );
            setRole(res.data.role.toLowerCase());
            setToken(res.data.token);
            setIsAuthenticated(true);
            setPublicKey(props.ual.activeUser.pubKeys[0]);
            setUserAccount(props.ual.activeUser.accountName);
          });
      }
    }
  }, [props.ual.activeUser]);

  return (
    <>
      <Router>
        <AuthenticationContext.Provider
          value={{
            isAuthenticated,
            userAccount,
            publicKey,
            token,
            logout: () => {
              props.ual.logout();
              setIsAuthenticated(false);
              setPublicKey('');
              setUserAccount('');
              setToken('');
            },
          }}
        >
          <div className="min-h-screen bg-primary">
            {!isAuthenticated && (
              <Route component={Login} path="/login" exact />
            )}
            {isAuthenticated && (
              <DashboardLayout role={role}>
                <Switch>
                  <Route component={Stories} path="/" exact />
                  <Route component={MyAssets} path="/assets" exact />
                  <Route component={FullStory} path="/story/:id" exact />

                  {role.toLowerCase() === 'super-admin' && (
                    <Route
                      component={ManageAdmins}
                      path="/manage-admins"
                      exact
                    />
                  )}

                  {role.toLowerCase() === 'admin' ||
                    (role.toLowerCase() === 'super-admin' && (
                      <>
                        <Route component={AddStory} path="/new-story" exact />
                        <Route component={AddLoginBanner} path="/login-banner" exact />
                        <Route
                          component={AdminEditStory}
                          path="/edit-story/:id"
                          exact
                        />
                        <Route component={AdminStories} path="/stories" exact />
                      </>
                    ))}
                </Switch>
              </DashboardLayout>
            )}
          </div>
          <Redirect to={isAuthenticated ? '/' : '/login'} />
        </AuthenticationContext.Provider>
      </Router>
    </>
  );
};

const myChain = {
  chainId: '1064487b3cd1a897ce03ae5b6a865651747e2e152090f99c1d19d44e01aea5a4',
  rpcEndpoints: [{ protocol: 'https', host: 'chain.wax.io', port: '' }],
};

const wax = new Wax([myChain], { appName: 'NFT Story Cards' });

const MyUALConsumer = withUAL(MyApp);

ReactDOM.render(
  <ModalContext.Provider>
    <UALProvider
      chains={[myChain]}
      authenticators={[wax]}
      appName={'NFT Story Cards'}
    >
      <MyUALConsumer />
    </UALProvider>
    ,
  </ModalContext.Provider>,
  document.getElementById('root')
);
