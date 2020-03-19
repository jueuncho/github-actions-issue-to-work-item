const core = require(`@actions/core`);
const github = require(`@actions/github`);
const azdev = require(`azure-devops-node-api`);

// create Work Item via https://docs.microsoft.com/en-us/rest/api/azure/devops/
async function createIssue(
	token,
	organization,
	projectName,
	title,
	description
) {
	let orgUrl = "https://dev.azure.com/" + organization;
	let authHandler = azdev.getPersonalAccessTokenHandler(token);
	let connection = new azdev.WebApi(orgUrl, authHandler);

	let workapi = await connection.getWorkItemTrackingApi();

	return workapi.createWorkItem(
		(customHeaders = []),
		(document = [
			{ op: "add", path: "/fields/System.Title", value: title },
			{ op: "add", path: "/fields/System.Description", value: description },
			{
				op: "add",
				path: "/fields/Microsoft.VSTS.Common.Priority",
				value: priority
			}
		]),
		(project = projectName),
		(type = `Issue`)
	);
}

try {
	let context = github.context;

	const env = process.env;

	console.log(`ado-organization: ${env.ado - organization}`);
	console.log(`ado-project: ${env.ado - project}`);
	console.log(`ado-wit: ${env.ado - wit}`);

	const payload = JSON.stringify(github.context.payload, undefined, 2);
	console.log(`The event payload: ${payload}`);

	//TBD: extract Issue info from context
	//TBD: createIssue()
} catch (error) {
	core.setFailed(error.message);
}
