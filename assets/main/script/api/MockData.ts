import MOCK_DATA from 'db://assets/doge/framework/network/MockHelper';
import { api } from './api';

Object.defineProperty(MOCK_DATA, api.report, {
    value: {}
})