const path = require('path');
const fs = require('fs');

const yaml = require('write-yaml');


/*
  helpers
*/

function createJSON(fileArray, data) {
    for (const [index, value] of fileArray.entries()) {
      data.jobs[`test${index + 1}`] = {
        working_directory: '~/tmp',
        docker: [
          {
            image: 'cypress/base:10',
            environment: {
              TERM: 'xterm',
            },
          },
        ],
        steps: [
          {
            attach_workspace: {
              at: '~/',
            },
          },
          {
            run: 'ls -la cypress',
          },
          {
            run: 'ls -la cypress/integration/Parallel/',
          },
          {
            run: {
              name: `Running cypress tests ${index + 1}`,
              command: `$(npm bin)/cypress run --spec cypress/integration/Parallel/${value} --reporter mochawesome --reporter-options "reportFilename=test${index + 1}"`,
            },
          },
          {
            store_artifacts: {
              path: 'cypress/videos',
            },
          },
          {
            store_artifacts: {
              path: 'cypress/screenshots',
            },
          },
          {
            store_artifacts: {
              path: 'mochawesome-report',
            },
          },
        ],
      };
      data.workflows.build_and_test.jobs.push({
        [`test${index + 1}`]: {
          requires: [
            'build',
          ],
        },
      });
    }
    return data;
  }