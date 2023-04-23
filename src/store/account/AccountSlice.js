import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeAccountTab: 0,
  AccountTabs: [
    {
      id: 0,
      name: "User Profile",
      slug: "user-profile",
    },
    {
      id: 1,
      name: "Change Password",
      slug: "change-password",
    },
    {
      id: 2,
      name: "Logout",
      slug: "log-out",
    },
  ],
};

export const AccountSlice = createSlice({
  name: "Account",
  initialState,
  reducers: {
    setActiveAccountTab: (state, action) => {
      state.activeAccountTab = action.payload;
    },
  },
});

export const { setActiveAccountTab } = AccountSlice.actions;
export default AccountSlice.reducer;
