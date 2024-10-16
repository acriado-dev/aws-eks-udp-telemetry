#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { UdpInfraStack } from '../lib/udp-infra-stack';
import * as blueprints from '@aws-quickstart/eks-blueprints';
import ClusterConstruct from "../lib/stack/eks-pipeline-stack";
import {NetworkingStack} from "../lib/stack/networking-stack";
import dotenv = require('dotenv');
dotenv.config();

const app = new cdk.App();
new UdpInfraStack(app, 'UdpInfraStack', {
});

