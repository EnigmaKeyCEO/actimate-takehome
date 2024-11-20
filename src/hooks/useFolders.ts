import React, { useState, useEffect, useCallback, useContext } from "react";
import type { Folder, SortOptions, CreateFolderInput } from "../types";
import { FolderContext } from "#/providers/FolderProvider";

export function useFolders(parentId?: string) {
  const {
    folders,
    loading,
    error,
    createFolder,
    deleteFolder,
    loadMoreFolders,
    refreshFolders,
    sortOptions,
    setSortOptions,
    parentId: currentParentId,
    setParentId,
  } = useContext(FolderContext);

  useEffect(() => {
    if (parentId) {
      setParentId(parentId);
    }
  }, [parentId]);

  return {
    parentId: currentParentId,
    folders:
      folders ||
      (process.env.NODE_ENV === "development"
        ? [
            {
              parentId: "root",
              createdAt: "2024-11-20T01:53:35.555Z",
              id: "a284da98-268b-4d5e-b125-7e480955a3c2",
              name: "asdf",
              updatedAt: "2024-11-20T01:53:35.555Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T01:58:31.996Z",
              id: "88d7858d-5f36-432b-a933-b16875eac47a",
              name: "hello_world",
              updatedAt: "2024-11-20T01:58:31.996Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T02:08:15.869Z",
              id: "8ca63f8b-8855-4ca0-b0a2-1c9b2aea861e",
              name: "asdfff",
              updatedAt: "2024-11-20T02:08:15.869Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T03:36:41.138Z",
              id: "95d09c37-7f69-4811-8dd5-05c1ad18d190",
              name: "hello",
              updatedAt: "2024-11-20T03:36:41.138Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T03:37:50.457Z",
              id: "ca7b0ba6-5698-4aea-9df4-7480e0930e16",
              name: "a",
              updatedAt: "2024-11-20T03:37:50.457Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T04:02:49.787Z",
              id: "791ad266-632a-4198-9a2c-c23db47871d9",
              name: "fdsa",
              updatedAt: "2024-11-20T04:02:49.787Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T04:05:54.384Z",
              id: "381ee8c8-fcaf-48a0-a277-40cf0840dfa9",
              name: "assa",
              updatedAt: "2024-11-20T04:05:54.384Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T04:08:15.668Z",
              id: "18d5d27c-7101-4e2e-bb95-74e6f44ec699",
              name: "ffffffff",
              updatedAt: "2024-11-20T04:08:15.668Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T05:11:49.041Z",
              id: "37de28bb-32b9-4cfd-8903-1bdb0fb229f2",
              name: "aaabbb",
              updatedAt: "2024-11-20T05:11:49.041Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T05:15:15.016Z",
              id: "e2fb4191-f1de-4def-bfec-4f3451aeb943",
              name: "rrr",
              updatedAt: "2024-11-20T05:15:15.016Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T05:16:44.658Z",
              id: "a8fb2efd-1179-4b8d-951c-8c714900c19f",
              name: "asdfgh",
              updatedAt: "2024-11-20T05:16:44.658Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T05:18:27.931Z",
              id: "01aa6481-f179-4fc8-ab45-ff80fd5004ba",
              name: "aa",
              updatedAt: "2024-11-20T05:18:27.931Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T05:19:16.517Z",
              id: "9deecf4b-51db-4ea0-a928-767449ba70b7",
              name: "bbb",
              updatedAt: "2024-11-20T05:19:16.517Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T05:26:04.865Z",
              id: "8b8e9d7c-2e46-4b42-a863-e5d12c20d5ea",
              name: "asdsasd",
              updatedAt: "2024-11-20T05:26:04.865Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T05:27:44.968Z",
              id: "0338507c-9d92-45b2-be65-bba9d212559e",
              name: "asdf",
              updatedAt: "2024-11-20T05:27:44.968Z",
            },
            {
              parentId: "root",
              createdAt: "2024-11-20T05:31:49.440Z",
              id: "edace3ef-99c8-4c96-8383-73a0be592ab0",
              name: "rreer",
              updatedAt: "2024-11-20T05:31:49.440Z",
            },
          ]
        : []),
    loading,
    error,
    createFolder,
    deleteFolder,
    loadMoreFolders,
    refreshFolders,
  };
}

export default useFolders;
