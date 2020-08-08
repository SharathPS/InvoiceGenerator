import React, {useState} from 'react';
import {
    Button,
    Col,
    ControlLabel,
    Form,
    FormControl,
    FormGroup,
    PageHeader,
} from 'react-bootstrap';
import {symbols} from 'currencyformatter.js';
import dequal from 'dequal';
import 'bootstrap/dist/css/bootstrap.css';

import './App.css';
import HistoryList from './HistoryList';
import LineItemList from './LineItemList.js';
import {saveInvoicePDF} from './PDFService.js';
import useLocalStorage from './useLocalStorage.ts';

const currencyCodes = Object.keys(symbols);

const emptyState = {
    invoiceNumber: '',
    fromName: 'Lakshmi Readymades & Agencies',
    fromTown:'Palamaner',
    fromGst:'GSTIN:37ACBPP0224C1Z8',
    imageLogo: null,
    paymentTerms: null,
    currency: 'INR',
    toName: '',
    date: '',
    dueDate: null,
    lineItems: [],
    notes: null,
    terms: null,
};

function App() {
    const [editedInvoice, setEditedInvoice] = useState(emptyState);
    const [historyStates, setHistoryStates] = useLocalStorage(
        'invoiceHistory',
        [],
    );

    function onFieldValueChange(propertyName, event) {
        let newVal = event.target.value;
        let stateUpdate = {};
        stateUpdate[propertyName] = newVal;
        setEditedInvoice({
            ...editedInvoice,
            ...stateUpdate,
        });
    }

    function onImageLogoChange(event) {
        let files = event.target.files;
        let stateUpdate = {};
        if (files.length > 0) {
            stateUpdate.imageLogo = files[0];
        }
        setEditedInvoice({...editedInvoice, ...stateUpdate});
    }

    function onLineItemDescriptionChange(params) {
        let lineItems = editedInvoice.lineItems;
        let lineItem = lineItems[params.index];
        lineItem.description = params.newDescription;
        setEditedInvoice({
            ...editedInvoice,
            lineItems: lineItems,
        });
    }

    function onLineItemQuantityChange(params) {
        let lineItems = editedInvoice.lineItems;
        let lineItem = lineItems[params.index];
        lineItem.quantity = params.newQuantity;
        setEditedInvoice({
            ...editedInvoice,
            lineItems: lineItems,
        });
    }

    function onLineItemMtsChange(params) {
        let lineItems = editedInvoice.lineItems;
        let lineItem = lineItems[params.index];
        lineItem.mts = params.newMts;
        setEditedInvoice({
            ...editedInvoice,
            lineItems: lineItems,
        });
    }

    function onLineItemRateChange(params) {
        let lineItems = editedInvoice.lineItems;
        let lineItem = lineItems[params.index];
        lineItem.rate = params.newRate;
        setEditedInvoice({
            ...editedInvoice,
            lineItems: lineItems,
        });
    }

    function onLineItemDeleteClick(params) {
        let lineItems = editedInvoice.lineItems;
        lineItems.splice(params.index, 1);
        setEditedInvoice({
            ...editedInvoice,
            lineItems: lineItems,
        });
    }

    function onLineItemAddClick() {
        let lineItems = editedInvoice.lineItems;
        lineItems.push({
            description: '',
            quantity: 0,
            mts: 0,
            rate: 0,
        });
        setEditedInvoice({
            ...editedInvoice,
            lineItems: lineItems,
        });
    }

    function onClearFormClick() {
        setEditedInvoice(emptyState);
    }

    function onRemoveImageClick() {
        // Clear out the input file element
        let inputElem = document.getElementById('imageLogo');
        inputElem.value = '';

        // Clear out the imageLogo on the state
        setEditedInvoice({
            ...editedInvoice,
            imageLogo: null,
        });
    }

    function onSubmitClick() {
        saveInvoicePDF(editedInvoice);
        if (!dequal(editedInvoice, historyStates[0])) {
            setHistoryStates([editedInvoice, ...historyStates.slice(0, 24)]);
        }
    }

    function onHistoryStateClick(historyState) {
        setEditedInvoice(historyState);
    }

    return (
        <div className="App">
            <div>
                <PageHeader>Lakshmi Readymades & Agencies Invoice</PageHeader>
                <div className="App-invoice">
                    <Form horizontal>
                        <FormGroup controlId="invoiceNumber">
                            <Col componentClass={ControlLabel} sm={2}>
                                Invoice #
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="text"
                                    value={editedInvoice.invoiceNumber}
                                    onChange={onFieldValueChange.bind(this, 'invoiceNumber')}
                                />
                            </Col>
                        </FormGroup>
                        {/*                        <FormGroup controlId="imageLogo">
                            <Col componentClass={ControlLabel} sm={2}>
                                Logo
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    type="file"
                                    onChange={onImageLogoChange.bind(this)}
                                />
                                {editedInvoice.imageLogo ? (
                                    <button onClick={onRemoveImageClick}>Remove image</button>
                                ) : null}
                            </Col>
                        </FormGroup>*/}
                        <FormGroup controlId="toName">
                            <Col componentClass={ControlLabel} sm={2}>
                                Bill To
                            </Col>
                            <Col sm={10}>
                                <FormControl
                                    componentClass="textarea"
                                    rows="3"
                                    placeholder="Who is this invoice to?"
                                    value={editedInvoice.toName}
                                    onChange={onFieldValueChange.bind(this, 'toName')}
                                />
                            </Col>
                        </FormGroup>
                        <FormGroup controlId="date">
                            <Col componentClass={ControlLabel} sm={2}>
                                Date
                            </Col>
                            <Col sm={3}>
                                <FormControl
                                    type="date"
                                    value={editedInvoice.date}
                                    onChange={onFieldValueChange.bind(this, 'date')}
                                />
                            </Col>
                        </FormGroup>
                        <LineItemList
                            lineItems={editedInvoice.lineItems}
                            currency={editedInvoice.currency}
                            onLineItemDescriptionChange={onLineItemDescriptionChange}
                            onLineItemQuantityChange={onLineItemQuantityChange}
                            onLineItemMtsChange={onLineItemMtsChange}
                            onLineItemRateChange={onLineItemRateChange}
                            onLineItemDeleteClick={onLineItemDeleteClick}
                            onLineItemAddClick={onLineItemAddClick}
                        />
                    </Form>
                </div>
                <div className="Footer-Container">
                    <div className="Footer">
                        <Col sm={2}>
                            <Button onClick={onClearFormClick}>Clear Form</Button>
                        </Col>
                        <Col smOffset={8} sm={2}>
                            <Button onClick={onSubmitClick} bsStyle="primary">
                                Create Invoice
                            </Button>
                        </Col>
                    </div>
                </div>
            </div>
            <div>
                <HistoryList
                    historyStates={historyStates}
                    onHistoryStateClick={onHistoryStateClick}
                />
            </div>
        </div>
    );
}

export default App;
