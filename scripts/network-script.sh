filename=/sdcard/androidmon.conf;
echo 0 > $filename;
while true;
    do flag=$(cat $filename);
        if [ $flag -eq 1 ];
            then break;
        fi;
        processInfo=$(ps | grep %s$);
        processInfoArray=($processInfo);
        pid=${processInfoArray[1]};
        su -c LD_LIBRARY_PATH=/data/local/tmp ./data/local/tmp/nettomon $pid -l;
    done