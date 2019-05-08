require('dotenv').config;

process.env.TZ = 'UTC';
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'third-capstone-jwt-secret';
process.env.JWT_EXPIRY = '3h';
process.env.TEST_DB_URL = 'postgresql://jon@localhost/capstone-III-test';

const { expect } = require('chai');
const supertest = require('supertest');


global.expect = expect;
global.supertest = supertest;