import { useState, useEffect } from "react";
import { formatEther, parseEther } from "ethers";
import { Save, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { NetworkConfig } from "@/config/networks";
import { config } from "@/config/networks";
import { hapiProtocolABI } from "@/config/evm-abi";
import {
  readContract,
  waitForTransactionReceipt,
  writeContract,
} from "@wagmi/core";
import { getBalance } from "@wagmi/core";

interface AdminPanelProps {
  network: NetworkConfig;
  walletAddress: string;
}

export function AdminPanel({ network, walletAddress }: AdminPanelProps) {
  const [createFee, setCreateFee] = useState("");
  const [updateFee, setUpdateFee] = useState("");
  const [contractBalance, setContractBalance] = useState("0");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState<"create" | "update" | null>(null);
  // const [isClaiming, setIsClaiming] = useState(false);

  useEffect(() => {
    loadContractData();
  }, [network, walletAddress]);

  const loadContractData = async () => {
    setIsLoading(true);
    try {
      const updateAttestationFee = await readContract(config, {
        abi: hapiProtocolABI,
        address: network.attestationContract as `0x${string}`,
        functionName: "updateAttestationFee",
      });
      const createAttestationFee = await readContract(config, {
        abi: hapiProtocolABI,
        address: network.attestationContract as `0x${string}`,
        functionName: "createAttestationFee",
      });

      const balance = await getBalance(config, {
        address: network.attestationContract as `0x${string}`,
      });

      setCreateFee(formatEther(updateAttestationFee));
      setUpdateFee(formatEther(createAttestationFee));
      setContractBalance(formatEther(balance.value));
    } catch (error) {
      console.error("Error loading contract data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateFees = async (type: "create" | "update", fee: string) => {
    setIsSaving(type);
    try {
      const tx = await writeContract(config, {
        abi: hapiProtocolABI,
        address: network.attestationContract as `0x${string}`,
        functionName:
          type === "create"
            ? "setCreateAttestationFee"
            : "setUpdateAttestationFee",
        args: [parseEther(fee)],
      });
      const txReceipt = await waitForTransactionReceipt(config, { hash: tx });
      if (txReceipt.status === "success") {
        alert("Fees updated successfully!");
      }
    } catch (error) {
      console.error("Error updating fees:", error);
    } finally {
      setIsSaving(null);
      loadContractData();
    }
  };

  const claimBalance = async () => {
    // const connections = getConnections(config);
    // const result = await switchChain(config, {
    //   chainId: arbitrum.id,
    //   connector: connections[0]?.connector,
    // });
    // console.log(result, connections);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={loadContractData}
          disabled={isLoading}
        >
          <RefreshCw
            className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Fee Management</CardTitle>
          <CardDescription>
            Update the fees for creating and updating attestations on{" "}
            {network.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="createFee">
              Create Attestation Fee ({network.nativeCurrency.symbol})
            </Label>
            <Input
              id="createFee"
              type="number"
              step="0.000000000000000001"
              value={createFee}
              onChange={(e) => setCreateFee(e.target.value)}
              placeholder="0.01"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => updateFees("create", createFee)}
            disabled={isLoading || isSaving === "create"}
            className="w-full text-black"
          >
            <Save className=" mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="updateFee">
              Update Attestation Fee ({network.nativeCurrency.symbol})
            </Label>
            <Input
              id="updateFee"
              type="number"
              step="0.000000000000000001"
              value={updateFee}
              onChange={(e) => setUpdateFee(e.target.value)}
              placeholder="0.005"
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            onClick={() => updateFees("update", updateFee)}
            disabled={isLoading || isSaving === "update"}
            className="w-full text-black"
          >
            <Save className="mr-2 h-4 w-4" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contract Balance</CardTitle>
          <CardDescription>
            Claim the accumulated fees from the attestation contract
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <span className="text-lg font-medium">Current Balance:</span>
            <span className="text-lg">
              {contractBalance} {network.nativeCurrency.symbol}
            </span>
          </div>
        </CardContent>
        {/* <CardFooter>
          <Button
            onClick={claimBalance}
            // disabled={isLoading || Number.parseFloat(contractBalance) === 0}
            className="w-full"
            variant={
              Number.parseFloat(contractBalance) > 0 ? "default" : "outline"
            }
          >
            <Coins className="mr-2 h-4 w-4" />
            {isClaiming ? "Claiming..." : "Claim Balance"}
          </Button>
        </CardFooter> */}
      </Card>
    </div>
  );
}
