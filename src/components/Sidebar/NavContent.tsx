/* eslint-disable */
import "./Sidebar.scss";

import { Trans } from "@lingui/macro";
import { Accordion, AccordionDetails, AccordionSummary, Box, Link, Paper, Typography } from "@material-ui/core";
import React from "react";
import { NetworkId } from "src/constants";
import { useAppSelector } from "src/hooks";
import { useWeb3Context } from "src/hooks/web3Context";
import { Bond } from "src/lib/Bond";
import { IBondDetails } from "src/slices/BondSlice";

import HydranetLogo from "../../assets/hydranet-full-logo.png";
import DashboardLogo from "../../assets/icons/dashboard.png";
import BondLogo from "../../assets/icons/bond.png";
import StakeLogo from "../../assets/icons/stake.png";
import useBonds from "../../hooks/useBonds";
import WalletAddressEns from "../TopBar/Wallet/WalletAddressEns";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import { ExpandMore } from "@material-ui/icons";
import { NavLink } from "react-router-dom";
import { DisplayBondPrice } from "src/views/BondV2/BondV2";

type NavContentProps = {
  handleDrawerToggle?: () => void;
};

type CustomBond = Bond & Partial<IBondDetails>;

const useStyles = makeStyles(theme => ({
  ListItem: {
    alignItems: "center",
    marginLeft: "30px",
  },
}));

const NavContent: React.FC<NavContentProps> = ({ handleDrawerToggle }) => {
  const { networkId } = useWeb3Context();
  const { bonds } = useBonds(networkId);

  const classes = useStyles();

  const bondsV2 = useAppSelector(state => state.bondingV2.indexes.map(index => state.bondingV2.bonds[index]));

  const sortedBonds = bondsV2
    .filter(bond => bond.soldOut === false)
    .sort((a, b) => {
      return a.discount > b.discount ? -1 : b.discount > a.discount ? 1 : 0;
    });

  bonds.sort((a: CustomBond, b: CustomBond) => b.bondDiscount! - a.bondDiscount!);

  return (
    <Paper className="dapp-sidebar">
      <Box className="dapp-sidebar-inner" display="flex" justifyContent="space-between" flexDirection="column">
        <div className="dapp-menu-top">
          <Box className="branding-header">
            <Link href="https://hydranet.ai" target="_blank">
              {/* <SvgIcon
                color="primary"
                component={HydranetLogo}
                viewBox="0 0 151 100"
                style={{ minWidth: "151px", minHeight: "98px", width: "151px" }}
              /> */}
              <img
                src={HydranetLogo}
                alt="HydranetLogo"
                style={{ minWidth: "151px", minHeight: "auto", width: "200px" }}
              />
            </Link>
            <WalletAddressEns />
          </Box>

          <div className="dapp-menu-links">
            <div className="dapp-nav" id="navbarNav">
              {networkId === NetworkId.MAINNET ||
              networkId === NetworkId.TESTNET_RINKEBY ||
              networkId === NetworkId.ARBITRUM_TESTNET ||
              networkId === NetworkId.ARBITRUM ? (
                <>
                  <List component={"nav"}>
                    <ListItem
                      alignItems={"center"}
                      component={Link}
                      classes={{ root: classes.ListItem }}
                      href={"#/dashboard"}
                    >
                      <ListItemIcon>
                        <img src={DashboardLogo} style={{ width: "25px", height: "auto" }} />
                      </ListItemIcon>
                      <ListItemText primary={"Dashboard"} />
                    </ListItem>
                    <ListItem component={Link} classes={{ root: classes.ListItem }} href={"#/bonds"}>
                      <ListItemIcon>
                        <img src={BondLogo} style={{ width: "25px", height: "auto" }} />
                      </ListItemIcon>
                      <ListItemText primary={"Bond"} />
                    </ListItem>
                    <ListItem component={Link} classes={{ root: classes.ListItem }} href={"#/stake"}>
                      <ListItemIcon>
                        <img src={StakeLogo} style={{ width: "25px", height: "auto" }} />
                      </ListItemIcon>
                      <ListItemText primary={"Stake"} />
                    </ListItem>
                  </List>
                  {sortedBonds.length > 0 && (
                    <div className="dapp-menu-data discounts">
                      <div className="bond-discounts">
                        <Accordion className="discounts-accordion" square defaultExpanded={true}>
                          <AccordionSummary
                            expandIcon={
                              <ExpandMore className="discounts-expand" style={{ width: "18px", height: "18px" }} />
                            }
                          >
                            <Typography variant="body2">
                              <Trans>Active bonds</Trans>
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            {sortedBonds.map((bond, i) => {
                              return (
                                <Link
                                  component={NavLink}
                                  to={`/bonds/${bond.index}`}
                                  key={i}
                                  className={"bond"}
                                  onClick={handleDrawerToggle}
                                >
                                  <Typography variant="body2">
                                    {bond.displayName}
                                    <span className="bond-pair-roi">
                                      <DisplayBondPrice key={bond.index} bond={bond} />
                                    </span>
                                    {/* <span className="bond-pair-roi">
                                    <DisplayBondDiscount key={bond.index} bond={bond} />
                                  </span> */}
                                  </Typography>
                                </Link>
                              );
                            })}
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    </div>
                  )}

                  {/* NOTE (appleseed-olyzaps): OlyZaps disabled until v2 contracts */}
                  {/* <NavItem to="/zap" icon="zap" label={t`Zap`} /> */}

                  {/* {EnvHelper.isGiveEnabled(location.search) && (
                    <NavItem to="/give" icon="give" label={t`Give`} chip={t`New`} />
                  )} */}
                  {/* <NavItem to="/wrap" icon="wrap" label={t`Wrap`} /> */}
                  {/* <NavItem
                    href={"https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"}
                    icon="bridge"
                    label={t`Bridge`}
                  /> */}
                  {/* <Box className="menu-divider">
                    <Divider />
                  </Box>
                  <NavItem href="https://pro.hydranet.ai/" icon="olympus" label={t`Olympus Pro`} />
                  <NavItem to="/33-together" icon="33-together" label={t`3,3 Together`} />
                  <Box className="menu-divider">
                    <Divider />
                  </Box> */}
                </>
              ) : (
                <>
                  {/* <NavItem to="/wrap" icon="wrap" label={t`Wrap`} />
                  <NavItem
                    href="https://synapseprotocol.com/?inputCurrency=gOHM&outputCurrency=gOHM&outputChain=43114"
                    icon="bridge"
                    label={t`Bridge`}
                  /> */}
                </>
              )}
              {}
              {/* {Object.keys(externalUrls).map((link: any, i: number) => (
                <NavItem
                  key={i}
                  href={`${externalUrls[link].url}`}
                  icon={externalUrls[link].icon as any}
                  label={externalUrls[link].title as any}
                />
              ))} */}
            </div>
          </div>
        </div>
        {/* <Box className="dapp-menu-social" display="flex" justifyContent="space-between" flexDirection="column">
          <Social />
        </Box> */}
      </Box>
    </Paper>
  );
};

export default NavContent;
