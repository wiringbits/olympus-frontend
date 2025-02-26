import { useQuery } from "react-query";
import { NetworkId } from "src/constants";
import { SOHM_ADDRESSES, STAKING_ADDRESSES } from "src/constants/addresses";
import { createDependentQuery, parseBigNumber, queryAssertion } from "src/helpers";

import { useStaticSohmContract, useStaticStakingContract } from "./useContract";

export const stakingRebaseRateQueryKey = () => ["useStakingRebaseRate"];
export const useStakingRebaseRate = () => {
  const sohmContract = useStaticSohmContract(SOHM_ADDRESSES[NetworkId.ARBITRUM], NetworkId.ARBITRUM);
  const stakingContract = useStaticStakingContract(STAKING_ADDRESSES[NetworkId.ARBITRUM], NetworkId.ARBITRUM);

  // Get dependent data in parallel
  const useDependentQuery = createDependentQuery(stakingRebaseRateQueryKey());
  const stakingEpoch = useDependentQuery("stakingEpoch", () => stakingContract.epoch());
  const sohmCirculatingSupply = useDependentQuery("sohmCirculatingSupply", () => sohmContract.circulatingSupply());

  return useQuery<number, Error>(
    stakingRebaseRateQueryKey(),
    async () => {
      queryAssertion(stakingEpoch && sohmCirculatingSupply, stakingRebaseRateQueryKey());

      const circulatingSupply = parseBigNumber(sohmCirculatingSupply);
      const stakingReward = parseBigNumber(stakingEpoch.distribute);

      return stakingReward / circulatingSupply;
    },
    { enabled: !!stakingEpoch && !!sohmCirculatingSupply },
  );
};
