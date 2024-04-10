const { User } = require('../../../models');

/**
 * Checks for a duplicate email 
 * @param {string} email
 * @returns {Promise}
 */ 
async function duplicateEmailCheck(email) {
  try{
    const user = await User.findOne({email: email});
    return !!user;
  } catch (err) {
    console.error('Error occurred while checking for duplicate email: ', err);
    return false;
  }
}


/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Update existing user's password
 * @param {string} id - User ID
 * @param {string} password - Name
 * @returns {Promise}
 */
async function updatePassword(id, password){
return User.updateOne(
  {
    _id: id,
  },
  {
    $set: {
      password,
      },
    }
  );
}


/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

module.exports = {
  duplicateEmailCheck,
  getUsers,
  getUser,
  createUser,
  updateUser,
  updatePassword,
  deleteUser,
};
