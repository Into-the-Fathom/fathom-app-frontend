import styled from "styled-components";
import PropTypes from "prop-types";
import { default as ReactSelect } from "react-select";
import { isMobile } from "react-device-detect";

import Popout from "apps/charts/components/Select/popout";

import {
  customStyles,
  customStylesMobile,
  customStylesTime,
} from "apps/charts/components/Select/styles";
import { FC, memo } from "react";

const MenuLabel = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  justify-content: flex-start;
  flex-direction: row;
`;

const LabelBox = styled.div``;

const LogoBox = styled.div`
  width: 30px;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  margin-right: 8px;
`;

const CustomMenu = styled.div`
  background-color: white;
  position: absolute;
  border-radius: 16px;
  box-shadow: 0 4px 8px 0 rgba(47, 128, 237, 0.1), 0 0 0 0.5px var(--c-zircon);
  overflow: hidden;
  padding: 0;
  width: 180px;
  z-index: 5;
  margin-top: 10px;
  padding-top: 36px;
`;

const FixedToggle = styled.div`
  position: absolute;
  height: 24px;
  z-index: 10;
  background-color: white;
  width: 100%;
  top: 8px;
  display: flex;
  align-items: center;
  padding-left: 12px;
  & > input {
    margin-right: 8px;
  }
`;

const addressStart = new RegExp("^0x");
function customFilter(
  option: {
    data: {
      tokenAddress: string;
      label: string;
    };
  },
  searchText: string
) {
  const isAddress = addressStart.test(searchText);
  if (isAddress) {
    return option.data.tokenAddress
      .toString()
      .toLowerCase()
      .includes(searchText.toString().toLowerCase());
  }
  return option.data.label
    .toString()
    .toLowerCase()
    .includes(searchText.toString().toLowerCase());
}

type SelectProps = {
  [x: string]: any;
  options: any;
  onChange: any;
  setCapEth: any;
  capEth: any;
  tokenSelect?: boolean;
  placeholder: any;
};

const Select: FC<SelectProps> = (props) => {
  const {
    options,
    onChange,
    setCapEth,
    capEth,
    tokenSelect = false,
    placeholder,
    ...rest
  } = props;

  return tokenSelect ? (
    <ReactSelect
      placeholder={placeholder}
      isSearchable={true}
      onChange={onChange}
      options={options}
      value={placeholder}
      filterOption={customFilter}
      // @ts-ignore
      getOptionLabel={(option) => (
        <MenuLabel>
          <LogoBox>{(option as any).logo}</LogoBox>
          <LabelBox>{(option as any).label}</LabelBox>
        </MenuLabel>
      )}
      styles={isMobile ? customStylesMobile : customStyles}
      {...rest}
      components={{
        DropdownIndicator: () => (
          <span role="img" aria-label={"viewer"} style={{ marginRight: "8px" }}>
            🔎
          </span>
        ),
        Menu: (props: { children: any; innerRef: any; innerProps: any }) => {
          const { children, innerRef, innerProps } = props;
          return (
            <CustomMenu ref={innerRef} {...innerProps}>
              <FixedToggle>
                <input
                  name="isGoing"
                  type="checkbox"
                  checked={capEth}
                  onChange={() => {
                    setCapEth(!capEth);
                  }}
                />
                Hide Low Liquidity
              </FixedToggle>
              {children}
            </CustomMenu>
          );
        },
      }}
    />
  ) : (
    <ReactSelect
      placeholder={placeholder}
      isSearchable={true}
      onChange={onChange}
      options={options}
      styles={customStylesTime}
      {...rest}
    />
  );
};

Select.propTypes = {
  options: PropTypes.array.isRequired,
  onChange: PropTypes.func,
};

export default memo(Select);

export { Popout };
