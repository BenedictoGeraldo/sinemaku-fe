import { axiosInstance } from "@/services/api";

export type WatchlistItem = {
  id: string;
  userId: string;
  movieId: string;
  title: string;
  poster: string;
  watched: boolean;
  createdAt: string;
  updatedAt: string;
};

type UpdateWatchlistPayload = {
  watched?: boolean;
};

type CreateWatchlistPayload = {
  movieId: string;
  title: string;
  poster: string;
  watched?: boolean;
};

const authHeaders = (accessToken: string) => ({
  headers: {
    Authorization: `Bearer ${accessToken}`,
  },
});

export async function getWatchlist(
  accessToken: string,
): Promise<WatchlistItem[]> {
  const { data } = await axiosInstance.get<WatchlistItem[]>(
    "/watchlist",
    authHeaders(accessToken),
  );
  return data;
}

export async function addToWatchlist(
  payload: CreateWatchlistPayload,
  accessToken: string,
): Promise<WatchlistItem> {
  const { data } = await axiosInstance.post<WatchlistItem>(
    "/watchlist",
    payload,
    authHeaders(accessToken),
  );
  return data;
}

export async function updateWatchlist(
  id: string,
  payload: UpdateWatchlistPayload,
  accessToken: string,
): Promise<WatchlistItem> {
  const { data } = await axiosInstance.patch<WatchlistItem>(
    `/watchlist/${id}`,
    payload,
    authHeaders(accessToken),
  );
  return data;
}

export async function deleteWatchlist(
  id: string,
  accessToken: string,
): Promise<void> {
  await axiosInstance.delete(`/watchlist/${id}`, authHeaders(accessToken));
}
