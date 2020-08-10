import React, {Component} from 'react';
import PropTypes from 'prop-types';

import 'bootstrap/dist/css/bootstrap.css';

import {Button, Col, FormControl, Row} from 'react-bootstrap';

import {format, symbols} from 'currencyformatter.js';
import decode from './decode.js';

const currencyCodes = Object.keys(symbols);

class LineItemList extends Component {
    onLineItemDescriptionChange(index, event) {
        this.props.onLineItemDescriptionChange({
            index: index,
            newDescription: event.target.value,
        });
    }

    onLineItemQuantityChange(index, event) {
        this.props.onLineItemQuantityChange({
            index: index,
            newQuantity: event.target.value,
        });
    }

    onLineItemMtsChange(index, event) {
        this.props.onLineItemMtsChange({
            index: index,
            newMts: event.target.value,
        });
    }

    onLineItemRateChange(index, event) {
        this.props.onLineItemRateChange({
            index: index,
            newRate: event.target.value,
        });
    }

    onLineItemDeleteClick(index) {
        this.props.onLineItemDeleteClick({
            index: index,
        });
    }

    getLineItemsTotal(lineItems) {
        return lineItems.reduce((sum, lineItem) => {
            return sum + lineItem.rate * this.setDefaultValue(lineItem.mts);
        }, 0);
    }

    getLineItemsTotalWithGst(total) {
        return (2.5 / 100) * total;
    }

    setDefaultValue(value) {
        return value === 0 ? 1 : value;
    }

    renderLineItemRow(lineItem, index) {
        return (
            <Row key={index}>
                <Col sm={5}>
                    <FormControl
                        type="text"
                        value={lineItem.description}
                        onChange={this.onLineItemDescriptionChange.bind(this, index)}
                    />
                </Col>
                <Col sm={1} style={{paddingLeft: '7px', paddingRight: '7px'}}>
                    <FormControl
                        type="number"
                        min={1}
                        value={lineItem.mts}
                        onChange={this.onLineItemMtsChange.bind(this, index)}
                    />
                </Col>
                <Col sm={1} style={{paddingLeft: '7px', paddingRight: '7px'}}>
                    <FormControl
                        type="number"
                        min={1}
                        value={lineItem.quantity}
                        onChange={this.onLineItemQuantityChange.bind(this, index)}
                    />
                </Col>
                <Col sm={2} style={{paddingLeft: '7px', paddingRight: '7px'}}>
                    <FormControl
                        type="number"
                        min={1}
                        value={lineItem.rate}
                        onChange={this.onLineItemRateChange.bind(this, index)}
                    />
                </Col>
                <Col sm={2}>
                    {decode(
                        format(this.setDefaultValue(lineItem.mts) *
                            lineItem.rate, {
                            currency: this.props.currency
                        })
                    )}
                </Col>
                <Col sm={1}>
                    <Button
                        bsStyle="danger"
                        onClick={this.onLineItemDeleteClick.bind(this, index)}
                    >
                        X
                    </Button>
                </Col>
            </Row>
        );
    }

    render() {
        let lineItems = this.props.lineItems;
        let lineItemRows = lineItems.map(this.renderLineItemRow.bind(this));
        let lineItemsTotal = this.getLineItemsTotal(lineItems);
        let totalWithCgst = this.getLineItemsTotalWithGst(lineItemsTotal);
        let totalWithSgst = this.getLineItemsTotalWithGst(lineItemsTotal);
        let totalWithTax = Math.round(lineItemsTotal + totalWithCgst + totalWithSgst);
        return (
            <div>
                <Row>
                    <Col sm={5}>Item</Col>
                    <Col sm={1}>Mts</Col>
                    <Col sm={1}>Quantity</Col>
                    <Col sm={2}>Rate</Col>
                    <Col sm={2}>Amount</Col>
                    <Col sm={1}/>
                </Row>
                {lineItemRows}
                <Row>
                    <Col sm={12}>
                        <Button bsStyle="success" onClick={this.props.onLineItemAddClick}>
                            + Add Line Item
                        </Button>
                    </Col>
                </Row>
                <Row>
                    <Col sm={7}/>
                    <Col sm={3}>Total Value Before Tax</Col>
                    <Col sm={1}>{decode(format(lineItemsTotal, {currency: this.props.currency}))}</Col>
                    <Col sm={1}/>
                </Row>
                <Row>
                    <Col sm={7}/>
                    <Col sm={3}>CGST : 2.5%</Col>
                    <Col sm={1}>{decode(format(totalWithCgst, {currency: this.props.currency}))}</Col>
                    <Col sm={1}/>
                </Row>
                <Row>
                    <Col sm={7}/>
                    <Col sm={3}>SGST : 2.5%</Col>
                    <Col sm={1}>{decode(format(totalWithSgst, {currency: this.props.currency}))}</Col>
                    <Col sm={1}/>
                </Row>
                <Row>
                    <Col sm={7}/>
                    <Col sm={3}>Total Value After Tax</Col>
                    <Col sm={1}>{decode(format(totalWithTax, {currency: this.props.currency}))}</Col>
                    <Col sm={1}/>
                </Row>
            </div>
        );
    }
}

LineItemList.propTypes = {
    currency: PropTypes.oneOf(currencyCodes),
    lineItems: PropTypes.array,
    onLineItemDescriptionChange: PropTypes.func,
    onLineItemQuantityChange: PropTypes.func,
    onLineItemMtsChange: PropTypes.func,
    onLineItemRateChange: PropTypes.func,
    onLineItemDeleteClick: PropTypes.func,
};

LineItemList.defaultProps = {
    lineItems: [],
};

export default LineItemList;
