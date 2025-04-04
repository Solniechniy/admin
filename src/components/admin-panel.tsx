import { useState, useEffect } from "react";
import { formatEther } from "ethers";
import { Save, RefreshCw, Coins } from "lucide-react";
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
import type { Network, NetworkConfig } from "@/config/networks";

import useNetwork from "@/hooks/useNetwork";

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
  const [isClaiming, setIsClaiming] = useState(false);
  const { getAttestationData, updateAttestationFee, withdrawBalance } =
    useNetwork(network.id as Network);
  useEffect(() => {
    loadContractData();
  }, [network, walletAddress]);

  const loadContractData = async () => {
    setIsLoading(true);
    try {
      const { updateFee, createFee, balance } = await getAttestationData();
      console.log(updateFee, createFee, balance);
      if (!updateFee || !createFee || !balance) {
        throw new Error("No data found");
      }
      setCreateFee(formatEther(updateFee));
      setUpdateFee(formatEther(createFee));
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
      await updateAttestationFee(fee, type);
    } catch (error) {
      console.error("Error updating fees:", error);
    } finally {
      setIsSaving(null);
      loadContractData();
    }
  };

  const claimBalance = async () => {
    setIsClaiming(true);
    try {
      await withdrawBalance();
    } catch (error) {
      console.error("Error claiming balance:", error);
    } finally {
      setIsClaiming(false);
      loadContractData();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Admin Panel</h2>
        <Button
          variant="default"
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
            variant="default"
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
            variant="default"
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
        <CardFooter>
          <Button
            onClick={claimBalance}
            disabled={isLoading}
            className="w-full"
            variant={
              Number.parseFloat(contractBalance) > 0 ? "default" : "outline"
            }
          >
            <Coins className="mr-2 h-4 w-4" />
            {isClaiming ? "Claiming..." : "Claim Balance"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
