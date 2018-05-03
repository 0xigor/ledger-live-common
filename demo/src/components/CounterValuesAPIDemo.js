// @flow
import React, { Component } from "react";
import { connect } from "react-redux";
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableRow
} from "material-ui/Table";
import { withStyles } from "material-ui/styles";
import AppBar from "material-ui/AppBar";
import Toolbar from "material-ui/Toolbar";
import Button from "material-ui/Button";
import { CircularProgress } from "material-ui/Progress";
import Typography from "material-ui/Typography";
import {
  listFiatCurrencies,
  listCryptoCurrencies
} from "@ledgerhq/live-common/lib/helpers/currencies";
import CurrencySelect from "./CurrencySelect";
import ExchangeSelect from "./ExchangeSelect";
import { marketsSelector } from "../reducers/markets";
import { addMarket, setMarket } from "../actions/markets";
import Price from "./Price";
import PriceGraph from "./PriceGraph";
import ReversePrice from "./ReversePrice";
import type { State } from "../reducers/markets";
import type { Currency } from "@ledgerhq/live-common/lib/types";
import CounterValues from "../countervalues";

const fromCurrencyList: Currency[] = listCryptoCurrencies().map(a => a);
const toCurrencyList: Currency[] = listFiatCurrencies().concat(
  listCryptoCurrencies()
);

const styles = theme => ({
  root: {
    width: "100%",
    overflowX: "auto"
  },
  flex: {
    flex: 1
  },
  table: {
    marginTop: theme.spacing.unit * 3,
    marginBottom: theme.spacing.unit * 3
  },
  footer: {
    display: "flex",
    justifyContent: "center"
  }
});

const mapStateToProps = state => ({
  markets: marketsSelector(state)
});

class App extends Component<{
  markets: State,
  classes: *,
  setMarket: *
}> {
  render() {
    const { classes, markets, setMarket, addMarket } = this.props;
    return (
      <CounterValues.PollingConsumer>
        {polling => (
          <div className={classes.root}>
            <AppBar position="static">
              <Toolbar>
                <Typography
                  variant="title"
                  color="inherit"
                  className={classes.flex}
                >
                  CounterValues API demo
                </Typography>
                {polling.pending ? (
                  <CircularProgress />
                ) : (
                  <Button onClick={polling.poll} color="inherit">
                    Poll
                  </Button>
                )}
              </Toolbar>
            </AppBar>

            <Table className={classes.table}>
              <TableHead>
                <TableRow>
                  <TableCell>from currency</TableCell>
                  <TableCell>to currency</TableCell>
                  <TableCell>exchange</TableCell>
                  <TableCell>price</TableCell>
                  <TableCell>reverse price</TableCell>
                  <TableCell>graph 1M</TableCell>
                  <TableCell>graph 1Y</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {markets.map(({ from, to, exchange }, index) => {
                  const complete = from && to && exchange;
                  return (
                    <TableRow key={index}>
                      <TableCell>
                        <CurrencySelect
                          currencies={fromCurrencyList}
                          value={from}
                          onChange={from => {
                            setMarket(index, { from });
                            polling.poll();
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <CurrencySelect
                          currencies={toCurrencyList}
                          value={to}
                          onChange={to => {
                            setMarket(index, { to });
                            polling.poll();
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {from && to ? (
                          <ExchangeSelect
                            from={from}
                            to={to}
                            value={exchange}
                            onChange={exchange => {
                              setMarket(index, { exchange });
                              polling.poll();
                            }}
                          />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {complete && from ? (
                          <Price
                            value={10 ** from.units[0].magnitude}
                            from={from}
                            to={to}
                            exchange={exchange}
                          />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {complete && to ? (
                          <ReversePrice
                            value={10 ** to.units[0].magnitude}
                            from={from}
                            to={to}
                            exchange={exchange}
                          />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {complete ? (
                          <PriceGraph
                            days={30}
                            from={from}
                            to={to}
                            exchange={exchange}
                            width={150}
                            height={50}
                          />
                        ) : null}
                      </TableCell>
                      <TableCell>
                        {complete ? (
                          <PriceGraph
                            days={365}
                            from={from}
                            to={to}
                            exchange={exchange}
                            width={150}
                            height={50}
                          />
                        ) : null}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            <footer className={classes.footer} onClick={addMarket}>
              <Button>ADD ROW</Button>
            </footer>
          </div>
        )}
      </CounterValues.PollingConsumer>
    );
  }
}

export default withStyles(styles)(
  connect(mapStateToProps, { setMarket, addMarket })(App)
);
