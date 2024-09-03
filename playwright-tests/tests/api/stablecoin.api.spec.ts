import { qase } from "playwright-qase-reporter";
import { test, expect } from "../../fixtures/apiFixture";
import { PoolDataApi } from "../../types";

test.describe("Stablecoin Subgraph API", () => {
  test(
    qase(
      71,
      "FXDStats Operation - Querying the operation with valid inputs is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        const response = await apiPage.sendFxdStatsOperationRequest();
        const responseJson = await response.json();
        expect(response.status()).toEqual(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        const protocolStatData = responseJson.data.protocolStat;
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: protocolStatData,
          propertyName: "id",
          expectedValue: "fathom_stats",
        });
        apiPage.assertStringPropertyExistsAndBiggerThanZero({
          parentObject: protocolStatData,
          propertyName: "totalSupply",
        });
        apiPage.assertStringPropertyExistsAndBiggerThanZero({
          parentObject: protocolStatData,
          propertyName: "tvl",
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: protocolStatData,
          propertyName: "__typename",
          expectedValue: "ProtocolStat",
        });
      });
    }
  );
  test(
    qase(
      73,
      "FXDPools Operation - Querying the operation with valid inputs is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        const response = await apiPage.sendFxdPoolsOperationRequest();
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("pools");
        const poolsArray = responseJson.data.pools;
        expect(Array.isArray(poolsArray)).toBe(true);
        expect(poolsArray.length).toBeGreaterThan(0);
        // Pools' checks
        for (const poolExpectedData of apiPage.poolsExpectedDataArray) {
          const currentPoolData = poolsArray.find(
            (pool: PoolDataApi) => pool.poolName === poolExpectedData.poolName
          );
          apiPage.validatePoolData({
            poolData: currentPoolData,
            expectedData: poolExpectedData,
          });
        }
      });
    }
  );

  test(
    qase(
      75,
      "FXDUser Operation - Querying with a valid proxy wallet address and existing active positions is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        let walletAddress: string;
        switch (apiPage.baseUrl) {
          case "https://graph.apothem.fathom.fi":
            walletAddress = "0xb61ff3e131f208298948cf1a58aee7c485d138be";
            break;
          case "https://graph.sepolia.fathom.fi":
            walletAddress = "0x1867d2b96d255922d3f640ef75c7fcf226e13447";
            break;
          case "https://graph.xinfin.fathom.fi":
            walletAddress = "0x0dc85d5bd14ea43a6a51c87d637b547da727aecc";
            break;
          default:
            throw new Error("GRAPH_API_BASE_URL value is invalid");
        }
        const response = await apiPage.sendFxdUserOperationRequest({
          walletAddress,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("users");
        const usersArray = responseJson.data.users;
        expect(Array.isArray(usersArray)).toBe(true);
        expect(usersArray.length).toEqual(1);
        const userFirst = usersArray[0];
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "activePositionsCount",
          expectedValue: "5",
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "id",
          expectedValue: walletAddress,
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "__typename",
          expectedValue: "User",
        });
      });
    }
  );

  test(
    qase(
      76,
      "FXDUser Operation - Querying with a valid proxy wallet address and no active positions is successful and returns correct data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        let walletAddress: string;
        switch (apiPage.baseUrl) {
          case "https://graph.apothem.fathom.fi":
            walletAddress = "0x6ae0a2dcf10723643ba54b7c641c34dc4b1e36c2";
            break;
          case "https://graph.sepolia.fathom.fi":
            walletAddress = "0x8177c3ec5e28d05e1b0454e02548799dd0e64438";
            break;
          case "https://graph.xinfin.fathom.fi":
            walletAddress = "0xccaf653fbfc2effc092045c104cbb669b6dfcbce";
            break;
          default:
            throw new Error("GRAPH_API_BASE_URL value is invalid");
        }
        const response = await apiPage.sendFxdUserOperationRequest({
          walletAddress,
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("users");
        const usersArray = responseJson.data.users;
        expect(Array.isArray(usersArray)).toBe(true);
        expect(usersArray.length).toEqual(1);
        const userFirst = usersArray[0];
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "activePositionsCount",
          expectedValue: "0",
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "id",
          expectedValue: walletAddress,
        });
        apiPage.assertStringPropertyExistsAndValueEquals({
          parentObject: userFirst,
          propertyName: "__typename",
          expectedValue: "User",
        });
      });
    }
  );

  test(
    qase(
      77,
      "FXDUser Operation - Querying with all 0s wallet in case user has still not created a valid proxy wallet is successful and correctly returns empty data"
    ),
    async ({ apiPage }) => {
      await test.step("Step 1", async () => {
        const response = await apiPage.sendFxdUserOperationRequest({
          walletAddress: "0x0000000000000000000000000000000000000000",
        });
        const responseJson = await response.json();
        expect(response.status()).toBe(200);
        apiPage.assertResponseBodyNotEmpty({ responseBody: responseJson });
        expect(responseJson).toHaveProperty("data");
        expect(responseJson.data).toHaveProperty("users");
        const usersArray = responseJson.data.users;
        expect(Array.isArray(usersArray)).toBe(true);
        expect(usersArray).toEqual([]);
      });
    }
  );
});
