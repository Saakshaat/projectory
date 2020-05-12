const { db } = require('../../util/admin')

exports.apply = (req, res) => {
    /**
     * - Check if the user is the creator. If so, say no.
     * - Check if the user is already in the interested array. If so, say no.
     * - Add user to interested array.
     * - Send an email to creator about the person.
     * - Send email to user about application confirmation with details.
     */
}

exports.showIntersted = (req, res) => {
    /**
     * - traverse through the chosen project's interested array and return entire user objects
     * - Client should have a seperate component for small snapshots of the user object
     */
}

exports.select = (req, res) => {
    /**
     * - move selected user from interested to team array
     * - update selected user's `projects_selected` field in the user object
     * - send selected user an email about selection
     */
}

exports.showTeam = (req, res) => {
    /**
     * - go through project's team array
     * - return entire user objects as response
     * - Client needs to make seperate components for small snapshots
     */
}

exports.removeMember = (req, res) => {
    /**
     * - move selected user from team to intersted array
     * - send selected user an email about removal
     * - update selected user's `projects_selected` field in the user object
     */
}

exports.finalizeTeam = (req, res) => {
    /**
     * - Send an email to everyone not selected (in the interested) about rejection.
     * - move project from open collection to closed collection
     * - (Optional) Delete the interested array
     */
}

exports.showMyApplications = (req, res) => {
    /**
     * Go through open projects return all projects where user's ID is in interested.
     */
}