import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import Helmet from 'react-helmet';
import { connect } from 'react-redux';
import { StripeProvider, Elements } from 'react-stripe-elements';
import { createSelector } from 'reselect';

import { userSelector } from '../redux/app';

import Spacer from '../components/util/Spacer';
import DonateForm from '../components/Donation/components/DonateForm';
import DonateCompletion from '../components/Donation/components/DonateCompletion';
import PoweredByStripe from '../components/icons/poweredByStripe';

import './index.css';

const propTypes = {
  email: PropTypes.string,
  show: PropTypes.bool
};

const mapStateToProps = createSelector(userSelector, ({ email = '' }) => ({
  email
}));

// Stripe public key
const stripeKey = 'pk_test_gqFA9NGMJiMawvkfLSdpjjxf';

class IndexPage extends Component {
  constructor(...props) {
    super(...props);
    this.state = {
      stripe: null
    };
  }
  componentDidMount() {
    if (window.Stripe) {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState(state => ({
        ...state,
        stripe: window.Stripe(stripeKey)
      }));
    } else {
      document.querySelector('#stripe-js').addEventListener('load', () => {
        // Create Stripe instance once Stripe.js loads
        console.info('stripe has loaded');
        this.setState(state => ({
          ...state,
          stripe: window.Stripe(stripeKey)
        }));
      });
    }
  }
  renderCompletion(props) {
    return <DonateCompletion close={() => {}} {...props} />;
  }
  render() {
    console.log(this.props);
    const { email = '' } = this.props;
    return (
      <div className="index-page-wrapper">
        <Spacer />
        <Spacer />
        <Helmet title="Support the freeCodeCamp.org nonprofit" />
        <Spacer />
        <Spacer />
        <h2 style={{ textAlign: 'center' }}>
          Support the freeCodeCamp.org nonprofit
        </h2>
        <StripeProvider stripe={this.state.stripe}>
          <Elements>
            <Fragment>
              <DonateForm
                email={email}
                renderCompletion={this.renderCompletion}
              />
              <Spacer />
              <PoweredByStripe />
              <Spacer />
            </Fragment>
          </Elements>
        </StripeProvider>
        <Spacer />
        <Spacer />
        <a href="/other-ways-to-donate">Other ways to donate.</a>
        <Spacer />
      </div>
    );
  }
}

IndexPage.displayName = 'IndexPage';
IndexPage.propTypes = propTypes;

export default connect(mapStateToProps)(IndexPage);