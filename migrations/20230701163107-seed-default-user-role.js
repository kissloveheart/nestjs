module.exports = {
	async up(db, client) {
		const seedData = [
			{
				name: 'User',
				description: 'Normal user',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				deletedAt: null,
			},
			{
				name: 'Admin',
				description: 'Admin user',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				deletedAt: null,
			},
		];
		await db.collection('user-roles').insertMany(seedData);
	},
	// 	const session = await client.startSession();
	// 	try {
	// 		await session.startTransaction();
	// 		await db.collection('user-roles').insertMany(seedData, { session });
	// 		await session.commitTransaction();
	// 	} catch (error) {
	// 		await session.abortTransaction();
	// 		throw error;
	// 	} finally {
	// 		await session.endSession();
	// 	}
	// },

	// async down(db, client) {},
};
