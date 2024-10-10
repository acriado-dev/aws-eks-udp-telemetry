#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import {UdpInfraStack} from '../lib/udp-infra-stack';
import dotenv = require('dotenv');

dotenv.config();

const app = new cdk.App();
new UdpInfraStack(app, 'UdpInfraStack', {
});
