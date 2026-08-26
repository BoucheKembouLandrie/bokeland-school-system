"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTransactionStatus = exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const BASE_URL = process.env.CAMPAY_BASE_URL || 'https://demo.campay.net/api';
const apiClient = axios_1.default.create({
    baseURL: BASE_URL,
    headers: {
        'Authorization': `Token ${process.env.CAMPAY_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    }
});
const initiatePayment = (amount, phoneNumber, description, externalReference) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield apiClient.post('/collect/', {
            amount: amount.toString(),
            currency: 'XAF',
            from: phoneNumber,
            description: description,
            external_reference: externalReference
        });
        return response.data;
    }
    catch (error) {
        console.error('CamPay Initiate Error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
});
exports.initiatePayment = initiatePayment;
const checkTransactionStatus = (reference) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const response = yield apiClient.get(`/transaction/${reference}/`);
        return response.data;
    }
    catch (error) {
        console.error('CamPay Status Error:', ((_a = error.response) === null || _a === void 0 ? void 0 : _a.data) || error.message);
        throw error;
    }
});
exports.checkTransactionStatus = checkTransactionStatus;
