db.createUser(
    {
        user: "mernauth_user",
        pwd: "mernauth_pass",
        roles: [
            {
                role: "readWrite",
                db: "mernauth"
            }
        ]
    }
)