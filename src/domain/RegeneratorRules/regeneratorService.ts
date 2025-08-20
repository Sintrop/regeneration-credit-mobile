import { regeneratorAdapter } from "./regeneratorAdapter";
import { regeneratorContract } from "./regeneratorContract";
import { CoordinateProps, RegeneratorProps } from "./types";

interface GetRegeneratorProps {
  rpc: string;
  address: string;
}
async function getRegenerator({ address, rpc }: GetRegeneratorProps): Promise<RegeneratorProps> {
  const response = await regeneratorContract.getRegenerator({ rpc, address })
  return regeneratorAdapter.parseFromContract(response);
}

interface GetProjectDescriptionProps {
  rpc: string;
  address: string;
}
async function getProjectDescription({ address, rpc }: GetProjectDescriptionProps): Promise<string> {
  const response = await regeneratorContract.projectDescriptions({ rpc, address })
  return response;
}

interface GetCoordinatesProps {
  rpc: string;
  address: string;
}
async function getCoordinates({ address, rpc }: GetCoordinatesProps): Promise<CoordinateProps[]> {
  const response = await regeneratorContract.getCoordinates({ rpc, address })
  return response.map(regeneratorAdapter.parseCoordinate);
}

export const regeneratorService = {
  getRegenerator,
  getProjectDescription,
  getCoordinates
}