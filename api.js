export const registerUserProfile = async (actor, name, age) => {
  try {
    const res = await actor.registerProfile(name, age);
    console.log("User registered:", res);
    return res;
  } catch (error) {
    console.error("Error registering user profile:", error);
    throw error;
  }
};

export const fetchUserDetails = async (actor) => {
  try {
    const res = await actor.getProfile();
    console.log("Fetched user details:", res);
    return res;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
