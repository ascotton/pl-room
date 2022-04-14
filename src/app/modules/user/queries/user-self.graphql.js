module.exports =
`query UserSelf {
    currentUser {
        id
        username
        firstName
        lastName
        permissions {
            manageCaseload
            viewSchedule
        }
        globalPermissions {
            addReferral
            addReferrals
            viewProviders
            viewOpenReferrals
            manageReferrals
            addEvaluation
            addDirectService
            provideServices
            viewCustomers
            mergeClient
        }
        enabledUiFlags
    }
}
`;
