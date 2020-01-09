clear all
clc
close all

%% Create some settings
Settings.personToParse = 1;
Settings.plotResults = false;
%Settings.maximumSize= 1000;
Settings.amountOfPersons =3;


%% load the original streamlines

load('FSmeshStreamlines.mat');
Fall = Fall{Settings.personToParse}; %Don't know what this is good for
sparseMatrixPerson = Ns{Settings.personToParse}; % The connections between nodes in a sparse matrix
% Matrix format: source, target, strength
Vall = Vall{Settings.personToParse}; % The locations of each node

% Select part of the connections
%Ns = Ns(1:8000,1:8000); 

% Select part of the values
%Vall = Vall(1:100000,:);
%mask = SupMotor{1};
 

%% Construct the binary mask
load('FSmeshStreamlinesMask.mat');

binaryMaskSup = SupMotor{Settings.personToParse};
lengthBinary = size(binaryMaskSup,1);
areaSup = sparse(lengthBinary,lengthBinary);
areaSup(binaryMaskSup,binaryMaskSup) = 1;

binaryMaskInf = InfMotor{Settings.personToParse};
lengthBinary = size(binaryMaskInf,1);
areaInf = sparse(lengthBinary,lengthBinary);
areaInf(binaryMaskInf,binaryMaskInf) = 1;

%% Apply the mask
sparseMatrixPersonSup = sparse(areaSup.*sparseMatrixPerson);
sparseMatrixPersonInf = sparse(areaInf.*sparseMatrixPerson);
 
csvwrite('test.csv',Vall)
% 
% 
% % Select all connections stronger than the treshold
% threshold = 1;
% mask = (abs(Ns) >= threshold);
% Ns = Ns.*mask;
% 
% 
% 
% % Create the matrix with:
% % Xstart, Ystart, Zstart, Xend, Yend, Zend, colour 
[source,target,colour] = find(sparseMatrixPersonInf);
total = [Vall(source,:),Vall(target,:),colour];
csvwrite('test2.csv',total)
