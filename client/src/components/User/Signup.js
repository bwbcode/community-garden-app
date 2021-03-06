import React, { useRef, useEffect, useState, useContext } from "react"
import { useForm } from "react-hook-form"
import GardenSearchAutocomplete from "./GardenSearchAutocomplete/GardenSearchAutocomplete"
import "./Signup.css"
import AuthenticationContext from "../../auth/AuthenticationContext"

const Signup = () => {
  const authContext = useContext(AuthenticationContext)
  const [gardenMembership, setGardenMembership] = useState("")
  const { register, formState: { errors }, handleSubmit, watch, setValue } = useForm({})
  const username = useRef({})
  const email = useRef({})
  const password = useRef({})
  const confirmPassword = useRef({})
  username.current = watch("username", "")
  email.current = watch("email", "")
  password.current = watch("password", "")
  confirmPassword.current = watch("confirmPassword", "")

  async function onSubmit(data) {
    let fetchUrl = "/api/user/signup"
    let fetchOptions = {
      method: "post",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(data)
    }

    try { 
      let response = await fetch(fetchUrl, fetchOptions)
      let resObject = await response.json()
      // prompt them to logout if they're logged in
      if (resObject.isAlreadyLoggedIn) {
        let willTheyLogOut = window.confirm("You must be logged out to sign up. Logout?")
        if (willTheyLogOut) {await authContext.logOut()}
      }
      else {
        let { username, password } = data
        alert(resObject.message)
        await authContext.logIn({username, password})
      }
    }
    catch(err) {
      console.log('Error signing up: ', err)
      alert("There was an error signing you up. We're fixing it as fast as we can.")
    }
  }

  function validatePass(password) {
    return (
      /.{6,}$/.test(password) &&
      /[A-Z]+/.test(password) &&
      /[a-z]+/.test(password) &&
      /[0-9]+/.test(password)
    )
  }

  // update 'gardenMembership' input field whenever the piece of state is changed
  useEffect(() => setValue('gardenMembership', gardenMembership), [setValue, gardenMembership])

  return (
    <form className="signup-form-container" onSubmit={handleSubmit(async (data) => await onSubmit(data))}>
      <div className="signup-form">
      <div className="signup-form-content">
        <div className="form-control">
          <label htmlFor="username">
            Username
          </label>
          <input
            {...register("username", {
              validate: async (name) => await checkIsNameFree(name) || 'That name is taken.',
              required: "You must pick a username."
            })}
            type="text"
            name="username"
            id="username"
          />
          {errors.username && <p className="signup-form-error-message">{errors.username.message}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="email">
            Email
          </label>
          <input
            {...register("email", { 
              required: "You must provide an email address." })}
            type="email"
            name="email"
            id="email"
          />
        {errors.email && <p className="signup-form-error-message">{errors.email.message}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="password">
            Password
          </label>
          <input
            {...register("password", {
              required: "You must provide a password.",
              validate: (value) =>
                validatePass(value) ||
                "The password must contain an uppercase letter, a lowercase letter, a number, and be at least 6 characters long."
            })}
            type="password"
            name="password"
            id="password"
          />
          {errors.password && <p className="signup-form-error-message">{errors.password.message}</p>}
        </div>
        <div className="form-control">
          <label htmlFor="confirmPassword">
            Confirm password
          </label>
          <div style={{ display: "flex", color: "red" }}>
            <input
              {...register("confirmPassword", {
                required: true,
                validate: (value) => 
                  value === password.current || 
                  "The passwords do not match"
              })}
              type="password"
              name="confirmPassword"
              id="confirmPassword"
            />
            {errors.confirmPassword && <p>{errors.confirmPassword.message}</p>}
          </div>
        </div>
        <div className="form-control">
          <label htmlFor="howLongGardening">
            How long have you been gardening?
          </label>
          <select
            defaultValue="selectOne"
            {...register("howLongGardening", { required: false })}
            name="howLongGardening"
            id="howLongGardening"
          >
            <option value="selectOne" disabled>
              Please Select
            </option>
            <option value="lessThanOneYear">Less than 1 year</option>
            <option value="oneToFiveYears">1 to 5 years</option>
            <option value="moreThanFiveYears">More than 5 years</option>
          </select>
        </div>
        <div className="form-control">
          <label htmlFor="currentPlants">
            What types of plants are in your garden?
          </label>
          <div className="currentPlantsSelection" id="currentPlantsSelection">
            <div>
              <input
                {...register("currentPlants", { required: false })}
                type="checkbox"
                name="currentPlants"
                id="fruits"
                value="fruits"
              />
              <label htmlFor="fruits">fruits</label>
            </div>
            <div>
              <input
                {...register("currentPlants", { required: false })}
                type="checkbox"
                name="currentPlants"
                id="vegetables"
                value="vegetables"
              />
              <label htmlFor="vegetables">vegetables</label>
            </div>
            <div>
              <input
                {...register("currentPlants", { required: false })}
                type="checkbox"
                name="currentPlants"
                id="herbs"
                value="herbs"
              />
              <label htmlFor="herbs">herbs</label>
            </div>
            <div>
              <input
                {...register("currentPlants", { required: false })}
                type="checkbox"
                name="currentPlants"
                id="flowers"
                value="flowers"
              />
              <label htmlFor="flowers">flowers</label>
            </div>
            <div>
              <input
                {...register("currentPlants", { required: false })}
                type="checkbox"
                name="currentPlants"
                id="other"
                value="other"
              />
              <label htmlFor="other">other</label>
            </div>
          </div>
        </div>
        <div className="form-control postalCode">
          <label htmlFor="postalCode">
            Postal Code
          </label>
          <input
            {...register("postalCode", { required: false })}
            type="text"
            name="postalCode"
            id="postalCode"
          />
        </div>
        <div className="form-control gardenMembership">
          <label htmlFor="gardenMembership">
            If you're currently a member of a garden, search for it here.
          </label>         
          <GardenSearchAutocomplete 
          setGardenMembership={setGardenMembership}
          /> 
          <input 
            type='hidden'
            name='gardenMembership'
            {...register('gardenMembership')}
          />
        </div>
        <div>
          <input className="signupButton" type="submit" value="Submit" />
        </div>
      </div>
    </div>
    </form>
  )

  async function checkIsNameFree(name) {
    let submission = {nameData: name}
    let fetchUrl = "/api/user/check-is-name-free" 
    let fetchOptions = {
      method: 'post',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify(submission)
    }
    
    try {
      let response = await fetch(fetchUrl, fetchOptions)
      let resObject = await response.json()

      return resObject.result
    }
    catch (err) {
      console.error('Error validating name in MongoDBAtlas Cluster!', err)
    }
  }
}

export default Signup
