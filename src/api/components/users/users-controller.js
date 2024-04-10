const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUsers(request, response, next) {
  try {
    const users = await usersService.getUsers();
    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    const emailTaken = await usersService.duplicateEmail(email);
    if (emailTaken) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'This email has already been taken!'
      )
    }

    if (password_confirm != password){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Please make sure your password match!'
      )
    }

  const success = await usersService.createUser(name, email, password); 
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }


    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    const emailTaken = await usersService.duplicateEmail(email);
    if (emailTaken) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'This email has already been taken!'
      )
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handles password change request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updatePass(request, response, next){
  try {
    const id = request.params.id;
    const current_password= request.body.current_password;
    const new_password = request.body.new_password;
    const password_confirm = request.body.password_confirm;

    // checks if the current password inputted is correct
    const currentPassCheck = await usersService.matchPassword(id, current_password);
    if (!currentPassCheck){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password is incorrect!'
      )
    }

    if (new_password == current_password){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Please make sure your password is different than your old one!'
      )
    }

    if (password_confirm != new_password){
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Please make sure your password match!'
      )
    }


  const success = await usersService.changePassword(id, new_password); 
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }
  } catch(error) {
    return next(error);
  }
}


/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  updatePass,
};
