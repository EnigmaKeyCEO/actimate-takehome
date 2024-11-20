# Image Folder Management Mobile Application

## Introduction

This take-home project is designed to evaluate your skills. You will build a hybrid mobile application using **Expo (React Native)** and **TypeScript**, along with a backend API that leverages **AWS services**. The application focuses on managing image folders and images, including CRUD (Create, Read, Update, Delete) operations and paginated lists with sorting capabilities.

---

## Project Overview

### Mobile Client

- **Technology**: React Native with Expo, TypeScript
- **Screens**:
  1. **Folder Management Screen**:
     - Perform CRUD operations on image folders.
     - List and sort pages of folders based on different criteria (e.g., name, date).
  2. **Folder Detail Screen**:
     - Perform CRUD operations on images within a specific folder.
     - List and sort pages of images based on different criteria (e.g., name, date).

### Backend API

- **Technology**: Your choice
- **Endpoints**:
  - Support all CRUD and list operations required by the mobile client.
- **AWS Integration**:
  - Use the **AWS SDK for S3** to create signed URLs for image uploads and downloads.
- **Data Store**:
  - Utilize a datastore (e.g., SQLite, DynamoDB) to store folder and image metadata.
- **Assumptions**:
  - No user authentication is required.

---

## Deliverables

- **Frontend Client**:
  - A React Native application built with Expo that meets the project requirements.
  - A **README** with instructions for building and running the app using **Expo's EAS CLI**.
  - Must run on iOS simulator and an actual iPhone.
- **Backend API**:
  - A server application that meets the project requirements.
  - A **README** detailing the required environment variables and setup instructions.
  - Documentation or infrastructure as code (e.g., AWS CDK) for setting up necessary AWS resources.

---

## Evaluation Criteria

- **Functional Completeness**: All features work as specified.
- **Technical Proficiency**: Effective use of Expo, AWS SDK, TypeScript, and RESTful APIs.
- **Problem-Solving Skills**: Handling of edge cases and errors.
- **UI/UX**: The mobile client provides user with a positive experience.

---

## Submission Guidelines

- **Repository Access**:
  - Provide a link to your Git repository containing the project code.
- **Documentation**:
  - Ensure both frontend and backend have sufficient READMEs.
- **Instructions**:
  - Confirm that setup and run instructions are clear and accurate.
